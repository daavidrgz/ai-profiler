import { useState } from "react";
import styles from "./peopleList.module.scss";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { DivProps } from "@/utils/defaultInterfaces";
import { getDecadeColor, getGenderColor } from "@/utils/colors";
import { getMinDecade } from "@/utils/dates";
import { Person } from "@/model/person";

interface Props extends DivProps {
  people: Person[];
}

interface ListItemProps {
  person: Person;
  minDecade: number;
  onClick: () => void;
}

function ListItem({ person, minDecade }: ListItemProps) {
  return (
    <div className={styles.listItem}>
      <span className={styles.itemName}>{person.name}</span>
      <span
        style={{ color: getGenderColor(person.gender) }}
        className={styles.itemGender}
      >
        {person.gender}
      </span>
      <span
        style={{ color: getDecadeColor(person.birthDecade, minDecade) }}
        className={styles.itemDecade}
      >
        {person.birthDecade}s
      </span>
    </div>
  );
}

export default function PeopleList({ people, ...rest }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const minDecade = getMinDecade();

  return (
    <div className={styles.card} {...rest}>
      <div className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>DETAILED LIST</span>
      </div>
      <div className={styles.peopleList}>
        <div className={styles.listHeader}>
          <span className={styles.headerName}>NAME</span>
          <span className={styles.headerGender}>GENDER</span>
          <span className={styles.headerDecade}>BIRTH DECADE</span>
        </div>

        {people.map((person, idx) => (
          <ListItem
            key={idx}
            person={person}
            minDecade={minDecade}
            onClick={() => handlePersonClick(person)}
          />
        ))}
      </div>
    </div>
  );
}
