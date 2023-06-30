import { useMemo } from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { DivProps } from "@/utils/defaultInterfaces";
import { Person } from "@/model/person";
import { getAgeColors } from "@/utils/colors";
import { AgeSchema } from "@/model/age";
import Chart from "@/components/Charts/Chart";
import InfoCard from "./InfoCard/InfoCard";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function AgeChart({ people, selectedPerson, ...rest }: Props) {
  const medianAge = useMemo(() => {
    const ages = people.map((person) => person.age);
    ages.sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    const half = Math.floor(ages.length / 2);
    return ages[half];
  }, [people]);

  return (
    <Chart
      people={people}
      selectedPerson={selectedPerson}
      title={"AGE DISTRIBUTION"}
      label="Number of people"
      entityEnum={AgeSchema.Enum}
      colors={getAgeColors()}
      chartType="bar"
      attribute="age"
      dimmable
      {...rest}
    >
      <InfoCard
        title="MEDIAN AGE"
        icon={<DateRangeIcon />}
        mainValue={medianAge}
        secondaryValue="y/o"
      />
    </Chart>
  );
}
