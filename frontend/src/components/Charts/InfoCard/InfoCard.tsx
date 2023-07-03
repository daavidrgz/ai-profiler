import styles from "./infoCard.module.scss";

interface Props {
  title: string;
  icon: JSX.Element;
  mainValue: string | number;
  secondaryValue?: string | number;
  tooltip?: JSX.Element;
  unselectable?: boolean;
}

export default function InfoCard({
  title,
  icon,
  mainValue,
  secondaryValue,
  tooltip,
  unselectable = false,
}: Props) {
  return (
    <div
      style={{ userSelect: unselectable ? "none" : "auto" }}
      className={styles.infoCard}
      data-tooltip-id={tooltip && tooltip.props && tooltip.props.id}
    >
      <h3 className={styles.title}>
        <span>{title}</span>
        {icon}
      </h3>
      <div>
        <span className={styles.mainValue}>{mainValue}</span>
        {secondaryValue && (
          <span className={styles.secondaryValue}>{secondaryValue}</span>
        )}
      </div>
      {tooltip && tooltip}
    </div>
  );
}
