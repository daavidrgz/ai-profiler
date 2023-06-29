import { useEffect, useState } from "react";
import styles from "./peopleList.module.scss";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { DivProps } from "@/utils/defaultInterfaces";
import { getAgeColor, getGenderColor } from "@/utils/colors";
import { Person } from "@/model/person";
import { AnimatePresence, motion } from "framer-motion";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { capitalize } from "@/utils/formatter";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
  setSelectedPerson: (person: Person | null) => void;
}

interface ListItemProps {
  person: Person;
  onClick: () => void;
  selected: boolean;
}

interface ListHeaderItemProps {
  label: string;
  orderBy: string;
  onClick: () => void;
  currentOrderBy: "name" | "gender" | "age";
  currentOrder: "asc" | "desc";
}

function ListItem({ person, onClick, selected }: ListItemProps) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.4 }}
      className={styles.listItem}
      onClick={onClick}
      data-selected={selected}
    >
      <span className={styles.itemName}>{person.name}</span>
      <span
        style={{ color: getGenderColor(person.gender) }}
        className={styles.itemGender}
      >
        {capitalize(person.gender)}
      </span>
      <span
        style={{ color: getAgeColor(person.age) }}
        className={styles.itemDecade}
      >
        {person.age}
      </span>
    </motion.div>
  );
}

function ListHeaderItem({
  onClick,
  label,
  orderBy,
  currentOrderBy,
  currentOrder,
}: ListHeaderItemProps) {
  return (
    <div onClick={onClick}>
      <AnimatePresence>
        <motion.span key="span" layout transition={{ duration: 0.2 }}>
          {label}
        </motion.span>
        {currentOrderBy === orderBy && (
          <motion.div
            key="arrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowDownIcon
              className={styles.arrowIcon}
              data-order={currentOrder}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PeopleList({
  people,
  selectedPerson,
  setSelectedPerson,
  ...rest
}: Props) {
  const [orderedPeople, setOrderedPeople] = useState<Person[]>([]);
  const [currentOrder, setCurrentOrder] = useState<"asc" | "desc">("desc");
  const [currentOrderBy, setCurrentOrderBy] = useState<
    "name" | "age" | "gender"
  >("name");

  function handlePersonClick(person: Person) {
    if (selectedPerson?.name === person.name) {
      setSelectedPerson(null);
    } else {
      setSelectedPerson(person);
    }
  }

  function handleSort(prop: "name" | "gender" | "age") {
    if (currentOrderBy === prop) {
      setCurrentOrder(currentOrder === "asc" ? "desc" : "asc");
    } else {
      setCurrentOrderBy(prop);
      setCurrentOrder("desc");
    }
  }

  useEffect(() => {
    setOrderedPeople([
      ...people.sort((a, b) => {
        if (currentOrder === "asc") {
          if (a[currentOrderBy] < b[currentOrderBy]) return 1;
          else return -1;
        } else {
          if (a[currentOrderBy] > b[currentOrderBy]) return 1;
          else return -1;
        }
      }),
    ]);
  }, [people, currentOrder, currentOrderBy]);

  return (
    <div className={styles.card} {...rest}>
      <div className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>DETAILED LIST</span>
      </div>
      <div className={styles.peopleList}>
        <div className={styles.listHeader}>
          <ListHeaderItem
            label="NAME"
            orderBy="name"
            onClick={() => handleSort("name")}
            currentOrderBy={currentOrderBy}
            currentOrder={currentOrder}
          />

          <ListHeaderItem
            label="GENDER"
            orderBy="gender"
            onClick={() => handleSort("gender")}
            currentOrderBy={currentOrderBy}
            currentOrder={currentOrder}
          />

          <ListHeaderItem
            label="AGE"
            orderBy="age"
            onClick={() => handleSort("age")}
            currentOrderBy={currentOrderBy}
            currentOrder={currentOrder}
          />
        </div>

        <AnimatePresence>
          {orderedPeople.map((person, idx) => (
            <ListItem
              key={idx}
              selected={selectedPerson?.name === person.name}
              person={person}
              onClick={() => handlePersonClick(person)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
