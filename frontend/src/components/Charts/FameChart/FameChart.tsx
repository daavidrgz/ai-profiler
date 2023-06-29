import { FameSchema } from "@/model/fame";
import { Person } from "@/model/person";
import { getFameColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import Chart from "@/components/Charts/Chart";


interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function FameChart({ people, selectedPerson, ...rest }: Props) {
  return (
    <Chart
      gridArea="4 / 3 / 6 / 4"
      height={"min(35vh, 45vw)"}
      people={people}
      selectedPerson={selectedPerson}
      title={"FAME DISTRIBUTION"}
      entityEnum={FameSchema.Enum}
      colors={getFameColors()}
      chartType="doughnut"
      attribute="fame"
      dimmable
      {...rest}
    />
  );
}
