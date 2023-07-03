import { useEffect, useState } from "react";
import styles from "./peopleList.module.scss";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { DivProps } from "@/utils/defaultInterfaces";
import {
  getAgeColor,
  getFameColor,
  getGenderColor,
  getOccupationColor,
  getPersonalityTraitColor,
} from "@/utils/colors";
import { Person } from "@/model/person";
import { AnimatePresence, motion } from "framer-motion";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { capitalize, getPageArray } from "@/utils/utils";
import {
  PersonalityTrait,
  PersonalityTraitSchema,
} from "@/model/personalityTrait";
import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";
import DoubleArrowBackIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";

type OrderBy =
  | "name"
  | "age"
  | "gender"
  | "fame"
  | "occupation"
  | PersonalityTrait;
type Direction = "asc" | "desc";

interface Props extends DivProps {
  algorithm: ProfilingAlgorithm;
  people: Person[];
  selectedPerson: Person | null;
  setSelectedPerson: (person: Person | null) => void;
}

interface ListItemProps {
  person: Person;
  onClick: () => void;
  selected: boolean;
  columns: number;
  algorithm: ProfilingAlgorithm;
}

interface ListHeaderItemProps {
  label: string;
  orderBy: string;
  onClick: () => void;
  currentOrderBy: OrderBy;
  currentDirection: Direction;
  columns: number;
}

interface PageSelectorProps {
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
}

function ListItem({
  person,
  onClick,
  selected,
  columns,
  algorithm,
}: ListItemProps) {
  const width = `calc(100% / ${columns})`;
  return (
    <motion.div
      layout
      transition={{ duration: 0.4 }}
      className={styles.listItem}
      onClick={onClick}
      data-selected={selected}
    >
      <span style={{ width: width }}>{person.name}</span>
      <span
        style={{
          color: getGenderColor(person.gender),
          width: width,
        }}
      >
        {capitalize(person.gender)}
      </span>
      <span
        style={{
          color: getAgeColor(person.age),
          width: width,
        }}
      >
        {person.age}
      </span>
      {algorithm === "martinc" && (
        <>
          <span
            style={{
              color: getFameColor(person.fame!),
              width: width,
            }}
          >
            {capitalize(person.fame!)}
          </span>
          <span
            style={{
              color: getOccupationColor(person.occupation!),
              width: width,
            }}
          >
            {capitalize(person.occupation!)}
          </span>
        </>
      )}

      {algorithm === "grivas" && (
        <>
          {Object.values(PersonalityTraitSchema.Enum).map((trait) => (
            <span
              key={trait}
              style={{
                color: getPersonalityTraitColor(trait),
                width: width,
              }}
            >
              {person
                .personalityTraits!.find((t) => t.trait === trait)!
                .weight.toFixed(2)}
            </span>
          ))}
        </>
      )}
    </motion.div>
  );
}

function ListHeaderItem({
  onClick,
  label,
  orderBy,
  currentOrderBy,
  currentDirection,
  columns,
}: ListHeaderItemProps) {
  return (
    <div onClick={onClick} style={{ width: `calc(100% / ${columns})` }}>
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
              data-order={currentDirection}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PageSelector({ page, maxPage, setPage }: PageSelectorProps) {
  return (
    <div className={styles.pagesContainer}>
      <DoubleArrowBackIcon
        className={styles.arrowIcon}
        onClick={() => setPage(0)}
        data-disabled={page === 0}
      />
      {getPageArray(page + 1, maxPage + 1).map((p) => (
        <span
          key={p}
          onClick={() => setPage(p - 1)}
          data-selected={page === p - 1}
          className={styles.page}
        >
          {p}
        </span>
      ))}
      <DoubleArrowBackIcon
        style={{ transform: "rotate(180deg)" }}
        className={styles.arrowIcon}
        onClick={() => setPage(maxPage)}
        data-disabled={page === maxPage}
      />
    </div>
  );
}

export default function PeopleList({
  algorithm,
  people,
  selectedPerson,
  setSelectedPerson,
  ...rest
}: Props) {
  const [orderedPeople, setOrderedPeople] = useState<Person[]>([]);
  const [currentDirection, setCurrentDirection] = useState<Direction>("desc");
  const [currentOrderBy, setCurrentOrderBy] = useState<OrderBy>("name");
  const [page, setPage] = useState(0);

  const rowsPerPage = 40;
  const maxPage = Math.ceil(orderedPeople.length / rowsPerPage) - 1;

  function handlePersonClick(person: Person) {
    if (selectedPerson?.name === person.name) setSelectedPerson(null);
    else setSelectedPerson(person);
  }

  function handleSort(prop: OrderBy) {
    if (currentOrderBy === prop) {
      setCurrentDirection(currentDirection === "asc" ? "desc" : "asc");
    } else {
      setCurrentOrderBy(prop);
      setCurrentDirection("desc");
    }
  }

  useEffect(() => {
    setOrderedPeople([
      ...people.sort((a, b) => {
        let propA: string | number;
        let propB: string | number;

        if (
          // Workaround to avoid typescript errors
          currentOrderBy === "extroverted" ||
          currentOrderBy === "agreeable" ||
          currentOrderBy === "conscientious" ||
          currentOrderBy === "stable" ||
          currentOrderBy === "open"
        ) {
          propA = a.personalityTraits!.find(
            (trait) => trait.trait === currentOrderBy
          )!.weight;
          propB = b.personalityTraits!.find(
            (trait) => trait.trait === currentOrderBy
          )!.weight;
        } else {
          propA = a[currentOrderBy]!;
          propB = b[currentOrderBy]!;
        }

        if (currentDirection === "asc") {
          if (propA < propB) return 1;
          else return -1;
        } else {
          if (propA > propB) return 1;
          else return -1;
        }
      }),
    ]);
  }, [people, currentDirection, currentOrderBy]);

  let columns = 3;
  if (algorithm === "martinc") columns = 5;
  if (algorithm === "grivas") columns = 8;

  const normalProps = ["name", "gender", "age"] as const;
  const martincProps = ["fame", "occupation"] as const;
  const grivasProps = Object.values(PersonalityTraitSchema.Enum);

  return (
    <div className={styles.card} {...rest}>
      <div className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>PEOPLE LIST</span>
      </div>
      <div className={styles.peopleList}>
        <div className={styles.listHeader}>
          {normalProps.map((prop) => (
            <ListHeaderItem
              key={prop}
              label={capitalize(prop)}
              orderBy={prop}
              onClick={() => handleSort(prop)}
              currentOrderBy={currentOrderBy}
              currentDirection={currentDirection}
              columns={columns}
            />
          ))}

          {algorithm === "martinc" && (
            <>
              {martincProps.map((prop) => (
                <ListHeaderItem
                  key={prop}
                  label={capitalize(prop)}
                  orderBy={prop}
                  onClick={() => handleSort(prop)}
                  currentOrderBy={currentOrderBy}
                  currentDirection={currentDirection}
                  columns={columns}
                />
              ))}
            </>
          )}

          {algorithm === "grivas" && (
            <>
              {grivasProps.map((prop) => (
                <ListHeaderItem
                  key={prop}
                  label={capitalize(prop)}
                  orderBy={prop}
                  onClick={() => handleSort(prop)}
                  currentOrderBy={currentOrderBy}
                  currentDirection={currentDirection}
                  columns={columns}
                />
              ))}
            </>
          )}
        </div>

        <PageSelector page={page} maxPage={maxPage} setPage={setPage} />
        <AnimatePresence>
          {orderedPeople
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((person, idx) => (
              <ListItem
                key={idx}
                selected={selectedPerson?.name === person.name}
                person={person}
                onClick={() => handlePersonClick(person)}
                columns={columns}
                algorithm={algorithm}
              />
            ))}
        </AnimatePresence>
        <PageSelector page={page} maxPage={maxPage} setPage={setPage} />
      </div>
    </div>
  );
}
