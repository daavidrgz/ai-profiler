import { Person } from "@/model/person";
import { getOccupationColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import Chart from "@/components/Charts/Chart";
import { OccupationSchema } from "@/model/occupation";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function OccupationChart({
  people,
  selectedPerson,
  ...rest
}: Props) {
  return (
    <Chart
      gridArea="4 / 4 / 6 / 6"
      height="min(45vh, 40vw)"
      people={people}
      selectedPerson={selectedPerson}
      title={"OCCUPATION DISTRIBUTION"}
      entityEnum={OccupationSchema.Enum}
      colors={getOccupationColors()}
      chartType="pie"
      attribute="occupation"
      filtered
      dimmable
      {...rest}
    />
  );
}
