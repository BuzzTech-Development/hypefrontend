import store, {useAppDispatch} from "../../../../redux/store";
import {ActiveView} from "./type";
import {Button, List} from "antd";
import {Assignment, assignmentsSelectors} from "../../../../redux/assignmentSlice";

interface ViewAssignmentsProps {
    onChangeView: (activeView: ActiveView) => void;
}

const ViewAssignments = ({onChangeView}: ViewAssignmentsProps) => {
    const dispatch = useAppDispatch();
    const assignments: Assignment[] = assignmentsSelectors.selectAll(store.getState());

    console.log(assignments)

    return(<div>
        <h1>View Assignments</h1>
        <Button onClick={() => onChangeView('mainView')}>Back</Button>
        <List
            bordered
            dataSource={assignments}
            renderItem={item=>(
                <List.Item>
                    <p>{item.name}, {item.date}, {item.time}, {item.description}, {item.points}, {item.selectedBadge}</p>
                </List.Item>
            )}
        />
    </div>)
}

export default ViewAssignments;