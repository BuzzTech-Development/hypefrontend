import {Button} from "antd";
import {ActiveView} from "./type";

export interface MainViewProps {
    onChangeView: (activeView: ActiveView) => void;
}

export const MainView = ({ onChangeView }: MainViewProps) => {
    return (
        <div>
            <Button onClick={() => onChangeView('createAssignment')}>Create Assignment</Button>
            <Button onClick={() => onChangeView('viewAssignments')}>View Assignments</Button>
        </div>
    )
}