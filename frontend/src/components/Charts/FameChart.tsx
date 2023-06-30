import { FameSchema } from "@/model/fame";
import { Person } from "@/model/person";
import { getFameColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import Chart from "@/components/Charts/Chart";
import InfoCard from "./InfoCard/InfoCard";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import FlareRoundedIcon from "@mui/icons-material/FlareRounded";
import { count } from "@/utils/formatter";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function FameChart({ people, selectedPerson, ...rest }: Props) {
  const superstarCount = count(
    people,
    (person) => person.fame! === "superstar"
  );
  const superstarPercentage = (superstarCount / people.length) * 100;

  const starCount = count(people, (person) => person.fame! === "star");
  const starPercentage = (starCount / people.length) * 100;

  const risingCount = count(people, (person) => person.fame! === "rising");
  const risingPercentage = (risingCount / people.length) * 100;

  return (
    <Chart
      people={people}
      selectedPerson={selectedPerson}
      title={"FAME DISTRIBUTION"}
      label="Number of people"
      entityEnum={FameSchema.Enum}
      colors={getFameColors()}
      chartType="doughnut"
      attribute="fame"
      dimmable
      direction="horizontal"
      {...rest}
    >
      <InfoCard
        title="SUPERSTAR"
        icon={<FlareRoundedIcon />}
        mainValue={superstarCount}
        secondaryValue={`${superstarPercentage.toFixed(2)}%`}
      />

      <InfoCard
        title="STAR"
        icon={<StarOutlineRoundedIcon />}
        mainValue={starCount}
        secondaryValue={`${starPercentage.toFixed(2)}%`}
      />

      <InfoCard
        title="RISING"
        icon={<AutoGraphRoundedIcon />}
        mainValue={risingCount}
        secondaryValue={`${risingPercentage.toFixed(2)}%`}
      />
    </Chart>
  );
}
