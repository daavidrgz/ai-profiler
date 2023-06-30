import React, { useMemo } from "react";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import { DivProps } from "@/utils/defaultInterfaces";
import { Person } from "@/model/person";
import { count } from "@/utils/formatter";
import Chart from "@/components/Charts/Chart";
import { GenderSchema } from "@/model/gender";
import { getGenderColors } from "@/utils/colors";
import InfoCard from "./InfoCard/InfoCard";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function GenderChart({
  people,
  selectedPerson,
  ...rest
}: Props) {
  const maleCount = useMemo(
    () => count(people, (person) => person.gender === "male"),
    [people]
  );

  const femaleCount = useMemo(
    () => count(people, (person) => person.gender === "female"),
    [people]
  );

  const maleRatio = useMemo(
    () => ((maleCount / people.length) * 100).toFixed(2),
    [maleCount, people.length]
  );

  const femaleRatio = useMemo(
    () => ((femaleCount / people.length) * 100).toFixed(2),
    [femaleCount, people.length]
  );

  return (
    <Chart
      people={people}
      selectedPerson={selectedPerson}
      title={"GENDER DISTRIBUTION"}
      label="Number of people"
      entityEnum={GenderSchema.Enum}
      colors={getGenderColors()}
      chartType="pie"
      attribute="gender"
      dimmable
      {...rest}
    >
      <InfoCard
        title="MALE"
        icon={<MaleIcon />}
        mainValue={maleCount}
        secondaryValue={maleRatio + "%"}
      />
      <InfoCard
        title="FEMALE"
        icon={<FemaleIcon />}
        mainValue={femaleCount}
        secondaryValue={femaleRatio + "%"}
      />
    </Chart>
  );
}
