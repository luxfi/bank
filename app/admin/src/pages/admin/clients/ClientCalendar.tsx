import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import moment from "moment";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState, useCallback } from "react";
import Button from "../../../components/Button";
import { Form, Input, Row, Col, Typography, DatePicker, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {
    fetchAdminClient,
    resetSelectedClientUserData,
} from "../../../features/admin-clients/AdminClientsSlice";
import { EventInput } from "@fullcalendar/react";
import { EntityType } from '../../../features/registration/RegistrationSlice';
import { selectAdminClientRiskAssessment, selectAdminClientRiskAssessments, setRiskAssessmentData, submitAdminClientRiskAssessment, selectAdminClientsLoadingStatus, selectAdminClientUserData } from '../../../features/admin-clients/AdminClientsSlice';
import FullCalendar, {DateSelectArg, EventApi, EventClickArg} from "@fullcalendar/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayGridPlugin from "@fullcalendar/daygrid";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal } from "antd";



export default function ClientCalendar() {
    const dispatch = useAppDispatch();
    const { uuid } = useParams();
    const client = useAppSelector(selectAdminClientUserData);
    const type = client.entityType === EntityType.Business ? EntityType.Business : EntityType.Individual;

    useEffect(() => {
        if (uuid && uuid !== "new") {
            dispatch(fetchAdminClient({ uuid: uuid }));
        } else {
            dispatch(resetSelectedClientUserData());
        }
    }, [dispatch, uuid]);
    const riskAssessmentsData = useAppSelector(selectAdminClientRiskAssessments);
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>();
    const handleEvents = useCallback((events: EventApi[]) => setCurrentEvents(events), []);
    const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
        let title = prompt("Please enter the title of the event")?.trim();
        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
        if (title) {
          calendarApi.addEvent({
            id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });
        }
      }, []);
    const handleEventClick = useCallback((clickInfo: EventClickArg) => {
        let elements = Object.values(clickInfo.event.extendedProps);
        createModal({url: 'risk', title: "Risk Assessment", fields:elements});
    }, []);
    const [modalData, setModalData] = useState({url: '', title: '', fields: []});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    let eventGuid = 0;
    const createEventId = () => String(eventGuid++);
    var INITIAL_EVENTS: EventInput[] = [];
    var riskDetails;
    riskAssessmentsData.forEach((riskAssessmentData)=>{
        if(type === EntityType.Individual){
        riskDetails = [
            {name: 'sanction', label:"Sanction Country?",text: riskAssessmentData.sanction}, 
            {name: 'rating', label: "Rating Level?", text: riskAssessmentData.rating}, 
            // {name: 'apply', label: "Apply this case?", text: riskAssessmentData.apply}, 
            {name: 'pep', label: "Politically Exposed Person?", text: riskAssessmentData.pep}, 
            {name: 'adverse', label: "Adverse Information?", text: riskAssessmentData.adverseInformation},
            {name: 'aml', label: "Derived from an AML?", text: riskAssessmentData.aml},
            {name: 'sanctioned_jurisdiction', label: "Sanctioned Jurisdiction?", text: riskAssessmentData.sanctionedJurisdiction},
            {name: 'high_risk_jurisdiction', label: "High risk jurisdiction?", text: riskAssessmentData.highRiskJurisdiction},
            {name: 'third_party', label: '3rd party?', text: riskAssessmentData.thirdParty},
            {name: 'understood', label: 'fully understood?', text: riskAssessmentData.understood},
            {name: 'material_connection', label: 'material connection?', text: riskAssessmentData.materialConnection},
            {name: 'volume', label: 'Volume of trades?', text: riskAssessmentData.volume==="low"? "0 - 25": riskAssessmentData.volume==="med" ? "26 - 50": riskAssessmentData.volume==="hig" ? "51+": '' },
            {name: 'transaction', label: 'Value of transactions?', text: riskAssessmentData.transactions === "low" ? "<£10k" : riskAssessmentData.transactions === "med" ? "£10k - £50k": riskAssessmentData.transactions === "hig" ? "£50k - £100k" : ""},
            {name: 'risk_rating', label: 'Risk rating?', text: riskAssessmentData.riskRating},
            {name: 'completedby', label: 'Completed by who?', text: riskAssessmentData.completedBy},
            {name: 'completiondate', label: 'Completion Date', text: riskAssessmentData.completionDate},
            {name: 'director', label: 'Who is Director?', text: riskAssessmentData.director},
            {name: 'approvaldate', label: 'Approval Date?', text: riskAssessmentData.approvalDate},
            {name: 'client', label:'Who is Client?', text: riskAssessmentData.clientName},
            // {name: 'create', label: "Created Date", text: riskAssessmentData.createdAt},
            // {name: 'update', label: "Updated Date",  text: riskAssessmentData.updatedAt},
            {name: 'uuid', text: uuid}
        ];
       
        }else{
            riskDetails = [
                {name: 'sanction', label:"Sanction Country?",text: riskAssessmentData.sanction}, 
                {name: 'rating', label: "Rating Level?", text: riskAssessmentData.rating}, 
                // {name: 'apply', label: "Apply this case?", text: riskAssessmentData.apply}, 
                {name: 'known', label: "Is the Company known to CDAX?", text: riskAssessmentData.known}, 
                {name: 'yearsKnown', label: "If yes, how long have we known them?", text: riskAssessmentData.yearsKnown},
                {name: 'metFace', label: "Have the clients ever been met face to face?", text: riskAssessmentData.metFace},
                {name: 'numberOfBeneficialOwners', label: "Two or less Spouses/Partners?", text: riskAssessmentData.numberOfBeneficialOwners},
                {name: 'highRiskJurisdiction', label: "High risk jurisdiction?", text: riskAssessmentData.highRiskJurisdiction},
                {name: 'pep', label: 'family member/close associate of a PEP?', text: riskAssessmentData.pep},
                {name: 'adverseInformation', label: 'Any Adverse Information ?', text: riskAssessmentData.adverseInformation},
                {name: 'applicantForBusiness', label: 'Applicant for Business?', text: riskAssessmentData.applicantForBusiness},
                {name: 'valueOfEntity', label: 'VALUE OF ENTITY ?', text: riskAssessmentData.valueOfEntity},
                {name: 'volume', label: 'Volume of trades?', text: riskAssessmentData.volume==="low"? "0 - 25": riskAssessmentData.volume==="med" ? "26 - 50": riskAssessmentData.volume==="hig" ? "51+": '' },
                {name: 'transaction', label: 'Value of transactions?', text: riskAssessmentData.transactions === "low" ? "<£10k" : riskAssessmentData.transactions === "med" ? "£10k - £50k": riskAssessmentData.transactions === "hig" ? "£50k - £100k" : ""},
                {name: 'riskRating', label: 'Risk rating?', text: riskAssessmentData.riskRating},
                {name: 'activityRegulated', label: 'IS THE CLIENT’S ACTIVITY REGULATED?', text: riskAssessmentData.activityRegulated},
                {name: 'highRiskActivity', label: 'Is this business a high risk business?', text: riskAssessmentData.highRiskActivity},
                {name: 'businessPurposeOptions', label: 'business activity /purpose option of the company?', text: riskAssessmentData.businessPurposeOptions},
                {name: 'businessPurpose', label:'business activity /purpose of the company?', text: riskAssessmentData.businessPurpose},
                // {name: 'create', label: "Created Date", text: riskAssessmentData.createdAt},
                // {name: 'update', label: "Updated Date",  text: riskAssessmentData.updatedAt},
                {name: 'uuid', text: uuid}
            ]
        }
         
        INITIAL_EVENTS.push({
            id: createEventId(),
            title: "Risk",
            start: riskAssessmentData.updatedAt, 
            extendedProps: riskDetails
        });
    })
    
    const showModal = () => {
        setIsModalVisible(true);
    };
    const createModal = (modalData: any) => {
        setModalData(modalData);
        showModal();
    }
    const init = {
        create: '',
        update: '',
        sanction: '',
        rating: '',
        apply: '',
        pep: '',
        adverse: '',
        aml: '',
        sanctioned_jurisdiction: '',
        high_risk_jurisdiction: '',
        third_party: '',
        understood: '',
        material_connection: '',
        volume: '',
        transaction: '',
        risk_rating: '',
        completedby: '',
        completiondate: '',
        director: '',
        approvaldate: '',
        client: ''
    }
    const navigate = useNavigate();
    const defaultButtons = (
        <div>
            <Button secondary size = 'long' margin = '10px' onClick={() => {
                window.localStorage.setItem('new', String(uuid));
                navigate(-1)}
                }>
                New Risk Assessment
            </Button>
        </div>
    )
    return (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout navigationButtons={defaultButtons}>
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable={true}
                editable={true}
                initialEvents={INITIAL_EVENTS}
                locales={allLocales}
                locale="us"
                eventsSet={handleEvents}
                select={handleDateSelect}
                eventClick={handleEventClick}
                />
                <Modal 
                 title={modalData.title}
                 open = { isModalVisible } 
                 onCancel = {handleCancel} 
                 footer = {<Button secondary size="long" onClick={()=>handleCancel()}>Cancel</Button>}>
                    <Form
                        name="view risk"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        autoComplete="off"
                        initialValues={init}
                    >
                       { 
                        modalData.fields.map((field: any, key: any) => (
                        field.name === 'uuid' 
                        ? 
                            '' 
                        :
                            <Form.Item key = {key} label = {field.label} style = {{marginBottom: "10px"}}>
                                <Input name={field.name} value={field.text} />
                            </Form.Item>
                        ))
                    } 

                    </Form>
                </Modal>
            </AdminDashboardLayout>
        </RequireAuth>
    );
}
