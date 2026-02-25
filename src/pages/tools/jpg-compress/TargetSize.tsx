import { useParams } from "react-router-dom";
import JPGCompress from "./Index";

const TargetSize = () => {
    const { size } = useParams();
    return <JPGCompress targetSize={size} />;
};

export default TargetSize;
