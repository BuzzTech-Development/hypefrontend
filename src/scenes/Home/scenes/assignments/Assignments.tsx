import {useState} from "react";
import {ActiveView} from "./type";
import {MainView} from "./MainView";
import ViewAssignments from "./ViewAssignments";
import CreateAssignment from "./CreateAssignment";

const Assignments = () => {
    const [activeView, setActiveView] = useState<ActiveView>('mainView');

    const handleChangeView = (view: ActiveView) => {
        setActiveView(view);
    }

    switch (activeView) {
        case 'mainView':
            return <MainView onChangeView={handleChangeView} />
        case 'viewAssignments':
            return <ViewAssignments onChangeView={handleChangeView} />
        case 'createAssignment':
            return <CreateAssignment onChangeView={handleChangeView} />

    }
}

export default Assignments;