import argparse
import json
import math

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=str, required=True)
    parser.add_argument("--output", type=str, required=True)
    args = parser.parse_args()

    with open(args.input, "r") as f:
        lines = f.readlines()

    with open(args.output, "w") as f:
        for line in lines:
            lx = json.loads(line)
            decade = math.floor(lx["birthyear"] / 10) * 10
            lx["birthyear"] = f"{decade}s"
            f.write(json.dumps(lx) + "\n")
