import { Person } from "@/model/person";
import { getPersonalityTraitColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import Chart from "@/components/Charts/Chart";
import { PersonalityTraitSchema } from "@/model/personalityTrait";

const chartOptions = {
  scales: {
    y: {
      min: -0.5,
      max: 0.5,
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
      gridArea="4 / 3 / 6 / 6"
      height="min(45vh, 40vw)"
      people={people}
      selectedPerson={selectedPerson}
      title="PERSONALITY TRAITS"
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
      {...rest}
    ></Chart>
  );
}
