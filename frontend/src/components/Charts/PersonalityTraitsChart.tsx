import { Person } from "@/model/person";
import { getPersonalityTraitColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import Chart from "@/components/Charts/Chart";
import { PersonalityTraitSchema } from "@/model/personalityTrait";

const chartOptions = {
  scales: {
    y: {
      ticks: {
        stepSize: 0.1,
      },
    },
  },
};

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function PersonalityTraitsChart({
  people,
  selectedPerson,
  ...rest
}: Props) {
  return (
    <Chart
      people={people}
      selectedPerson={selectedPerson}
      title="PERSONALITY TRAITS"
      label="Weight"
      noContentMessage="Click a person in order to see its personality traits."
      entityEnum={PersonalityTraitSchema.Enum}
      colors={getPersonalityTraitColors()}
      data={
        !selectedPerson
          ? []
          : Object.values(PersonalityTraitSchema.Enum).map(
              (personalityTrait) =>
                selectedPerson.personalityTraits!.find(
                  (trait) => trait.trait === personalityTrait
                )!.weight
            )
      }
      chartType="bar"
      chartOptions={chartOptions}
      direction="horizontal"
      {...rest}
    ></Chart>
  );
}
