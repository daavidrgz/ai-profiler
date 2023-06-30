from io import StringIO
import json
import requests
import re
import logging

logger = logging.getLogger("server_logger")


class TwitterService:
    def get_tweets(self, user: str):
        twitter_scraper = TwitterScraper(user)
        tweets = twitter_scraper.iter_tweets(limit=200)
        tweets_content = [tweet["content"] for tweet in tweets]

        output_file = StringIO()
        line = json.dumps({"id": user, "text": tweets_content})
        output_file.write(line + "\n")
        return output_file


class TwitterScraper:
    FEATURES_USER = '{"blue_business_profile_image_shape_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true}'
    FEATURES_TWEETS = '{"blue_business_profile_image_shape_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"vibe_api_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":false,"interactive_text_enabled":true,"responsive_web_text_conversations_enabled":false,"longform_notetweets_rich_text_read_enabled":true,"responsive_web_enhance_cards_enabled":false}'

    AUTHORIZATION_TOKEN = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
    HEADERS = {
        "authorization": "Bearer %s" % AUTHORIZATION_TOKEN,
    }

    GET_USER_URL = (
        "https://twitter.com/i/api/graphql/sLVLhk0bGj3MVFEKTdax1w/UserByScreenName"
    )
    GET_TWEETS_URL = (
        "https://twitter.com/i/api/graphql/CdG2Vuc1v6F5JyEngGpxVw/UserTweets"
    )
    FIELDNAMES = [
        "id",
        "tweet_url",
        "name",
        "user_id",
        "username",
        "published_at",
        "content",
        "views_count",
        "retweet_count",
        "likes",
        "quote_count",
        "reply_count",
        "bookmarks_count",
        "medias",
    ]

    def __init__(self, username):
        resp = requests.get("https://twitter.com/")
        self.gt = resp.cookies.get_dict().get("gt") or "".join(
            re.findall(r"(?<=\"gt\=)[^;]+", resp.text)
        )

        self.HEADERS["x-guest-token"] = getattr(self, "gt")
        self.username = username

    def get_user(self):
        arg = {"screen_name": self.username, "withSafetyModeUserFields": True}

        params = {
            "variables": json.dumps(arg),
            "features": self.FEATURES_USER,
        }

        response = requests.get(self.GET_USER_URL, params=params, headers=self.HEADERS)

        try:
            json_response = response.json()
        except requests.exceptions.JSONDecodeError:
            logger.info(response.status_code)
            logger.info(response.text)
            raise

        result = json_response.get("data", {}).get("user", {}).get("result", {})
        legacy = result.get("legacy", {})

        return {
            "id": result.get("rest_id"),
            "username": self.username,
            "full_name": legacy.get("name"),
        }

    def tweet_parser(self, user_id, full_name, tweet_id, item_result, legacy):
        medias = legacy.get("entities").get("media")
        medias = (
            ", ".join(
                [
                    "%s (%s)" % (d.get("media_url_https"), d.get("type"))
                    for d in legacy.get("entities").get("media")
                ]
            )
            if medias
            else None
        )

        return {
            "id": tweet_id,
            "tweet_url": f"https://twitter.com/{self.username}/status/{tweet_id}",
            "name": full_name,
            "user_id": user_id,
            "username": self.username,
            "published_at": legacy.get("created_at"),
            "content": legacy.get("full_text"),
            "views_count": item_result.get("views", {}).get("count"),
            "retweet_count": legacy.get("retweet_count"),
            "likes": legacy.get("favorite_count"),
            "quote_count": legacy.get("quote_count"),
            "reply_count": legacy.get("reply_count"),
            "bookmarks_count": legacy.get("bookmark_count"),
            "medias": medias,
        }

    def iter_tweets(self, limit=120):
        logger.info(f"[+] Scraping: {self.username}")
        _user = self.get_user()
        full_name = _user.get("full_name")
        user_id = _user.get("id")
        if not user_id:
            logger.info("[!] Error: no user id found")
            raise NotImplementedError
        cursor = None
        _tweets = []

        while True:
            var = {
                "userId": user_id,
                "count": 100,
                "cursor": cursor,
                "includePromotedContent": True,
                "withQuickPromoteEligibilityTweetFields": True,
                "withVoice": True,
                "withV2Timeline": True,
            }

            params = {
                "variables": json.dumps(var),
                "features": self.FEATURES_TWEETS,
            }

            response = requests.get(
                self.GET_TWEETS_URL,
                params=params,
                headers=self.HEADERS,
            )

            json_response = response.json()
            result = json_response.get("data", {}).get("user", {}).get("result", {})
            timeline = (
                result.get("timeline_v2", {})
                .get("timeline", {})
                .get("instructions", {})
            )
            entries = [
                x.get("entries")
                for x in timeline
                if x.get("type") == "TimelineAddEntries"
            ]
            entries = entries[0] if entries else []

            for entry in entries:
                content = entry.get("content")
                entry_type = content.get("entryType")
                tweet_id = entry.get("sortIndex")
                if entry_type == "TimelineTimelineItem":
                    item_result = (
                        content.get("itemContent", {})
                        .get("tweet_results", {})
                        .get("result", {})
                    )
                    legacy = item_result.get("legacy")

                    if legacy.get("user_id_str") == user_id:
                        tweet_data = self.tweet_parser(
                            user_id, full_name, tweet_id, item_result, legacy
                        )
                        _tweets.append(tweet_data)

                if (
                    entry_type == "TimelineTimelineCursor"
                    and content.get("cursorType") == "Bottom"
                ):
                    cursor = content.get("value")

                if len(_tweets) >= limit:
                    break

            logger.info(f"[#] tweets scraped: {len(_tweets)}")

            if len(_tweets) >= limit or cursor is None or len(entries) == 2:
                break

        return _tweets
