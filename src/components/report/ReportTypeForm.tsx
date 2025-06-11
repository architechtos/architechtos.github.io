
import ReportBasicInfo from "./ReportBasicInfo";

interface ReportTypeFormProps {
  animalType: string;
  setAnimalType: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

const ReportTypeForm = (props: ReportTypeFormProps) => {
  return <ReportBasicInfo {...props} />;
};

export default ReportTypeForm;
