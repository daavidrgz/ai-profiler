import { useState } from "react";
import styles from "./twitterInput.module.scss";

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
      <input
        className={styles.input}
        type="text"
        placeholder="Twitter username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        autoComplete="off"
      />
    </form>
  );
}
