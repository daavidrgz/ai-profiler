import { useState } from "react";
import styles from "./twitterInput.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  setUsername: (username: string) => void;
}

export default function TwitterInput({ setUsername }: Props) {
  const [usernameInput, setUsernameInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsername(usernameInput);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2 className={styles.title}>ENTER A TWITTER USERNAME</h2>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Twitter username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          autoComplete="off"
        />
        <span className={styles.at}>@</span>
        <button className={styles.searchButton} type="submit">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}
