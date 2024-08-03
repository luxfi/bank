import { useNavigate, useParams } from 'react-router';
import { Typography, RadioChangeEvent, Space } from 'antd';
import Button from "../../../components/Button";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { FlexContainer } from "../../../components/Card";
import styled from "styled-components";
import { Row, Col } from "antd";
import { Radio as R, Input, DatePicker } from 'antd';
import { PageTitle } from "../../dashboard/components/PageTitle";
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectAdminClientRiskAssessment,selectAdminClientRiskAssessments, setRiskAssessmentData, submitAdminClientRiskAssessment, selectAdminClientsLoadingStatus, selectAdminClientUserData } from '../../../features/admin-clients/AdminClientsSlice';
import moment from "moment";
import { EntityType } from '../../../features/registration/RegistrationSlice';
import { openNotification, openErrorNotification } from '../../../components/Notifications';
import { Spinner } from '../../../components/Spinner';
import BusinessRiskAssessmentPart from './BusinessRiskAssessmentPart';
import IndividualRiskAssessmentPart from './IndividualRiskAssessmentPart';
import { RiskAssessmentDto } from '../../../features/registration/model/riskAssessmentSchema';
import { date } from 'yup';
const { Text, Paragraph } = styled(Typography)`
    font-weight: 500;
`;

export default function RiskAssessment() {
    const {uuid} = useParams();
    const navigate = useNavigate();
    var value = useAppSelector(selectAdminClientRiskAssessment);
    var values = useAppSelector(selectAdminClientRiskAssessments);
    if(values.length>0) {
        if(window.localStorage.getItem('new')===String(uuid)){
            // window.localStorage.removeItem('new');
            // console.log(window.localStorage.getItem('new'));
        }else{
            const  date1 = values[0].updatedAt?.toString().slice(0, 10).split('-');
            const md = Number(date1?.pop());
            const mm = Number(date1?.pop())
            const my = Number(date1?.pop())
            const compareA = md + mm + my;
            value = values[0];
            Object.values(values).forEach((ele, index) => {
                var strDate = ele.updatedAt;
                var date2 = strDate?.toString().slice(0, 10).split('-');
                var cd = Number(date2?.pop()), cm = Number(date2?.pop()), cy=Number(date2?.pop());
                const compareB = cd + cm + cy;
                if(compareA < compareB){
                    value = ele;
                }
              });

            // value = values[0];
            
        }
        
    }
    
    const client = useAppSelector(selectAdminClientUserData);
    const type = client.entityType === EntityType.Business ? EntityType.Business : EntityType.Individual;
    const dispatch = useAppDispatch();
    const onChange = (e: any) => {
        let n = String(e.target.name);
        dispatch(setRiskAssessmentData({[n]: e.target.value}));
    };
    
    

    const saveData = async () => {
        try {
            await dispatch(submitAdminClientRiskAssessment({uuid: String(uuid), entityType: type})).unwrap();
            openNotification('Risk Assessment', 'Risk assessment has been updated successfully!');
        }
        catch {
            openErrorNotification('Risk Assessment', 'Sorry, something went wrong.');
        }
    }
    const loading = useAppSelector(selectAdminClientsLoadingStatus) === 'loading';
    const defaultButtons = (
        <div>
            <Button secondary size = 'long' margin = '10px' onClick={
                () =>{
                
                navigate('calendar')
            }} style = {{width: 'auto'}}>
                Open Calendar
            </Button>
        </div>
    )
    return (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout navigationButtons={defaultButtons}>
                <PageTitle style = {{color: "black", textAlign: "center", fontWeight: "bold"}}>
                    Risk Assessment
                </PageTitle>
                <FlexContainer>
                    <Paragraph>
                        To ensure that the risk rating is assessed accurately ALL sections and questions on this form must be completed
                    </Paragraph>
                    {type === EntityType.Business ? 
                        <BusinessRiskAssessmentPart value = {value} onChange = {onChange}  />
                    :
                        <IndividualRiskAssessmentPart value = {value} onChange = {onChange} />   
                    }
                    <Row style={{width: "100%"}}>
                        <Col lg = {18} style={{paddingRight: "30px"}}>
                            <Text strong style={{padding: "5px 15px"}}>
                                Assessment Completed by (name)
                            </Text>
                            <Input name = 'completedBy' value={value.completedBy} onChange = {onChange}/>
                        </Col>
                        <Col lg = {6}>
                            <Text strong>
                                Date
                            </Text>
                            <DatePicker 
                                style={{width: "100%"}} 
                                value = {value.completionDate ? moment(value.completionDate) : undefined}
                                onChange = {
                                    (date, dateString) => {
                                        dispatch(setRiskAssessmentData({completionDate: dateString}));
                                    }
                                }
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: "30px"}}>
                        <Paragraph strong style={{padding: "5px 15px"}}>
                            Where the rating is High Risk, involves a PEP or is being downgraded the application must also be approved by a Director.
                        </Paragraph>
                        <Col lg = {18} style={{paddingRight: "30px"}}>
                            <Text strong style={{padding: "5px 15px"}}>
                                Where applicable, Name of Director approving
                            </Text>
                            <Input name = 'director' value = {value.director ? value.director : ''} onChange = {onChange} />
                        </Col>
                        <Col lg = {6}>
                            <Text strong>
                                Date
                            </Text>
                            <DatePicker 
                                style={{width: "100%"}} 
                                value = {value.approvalDate ? moment(value.approvalDate) : undefined}
                                onChange = {
                                    (date, dateString) => {
                                        dispatch(setRiskAssessmentData({approvalDate: dateString}));
                                    }
                                }
                            />
                        </Col>
                    </Row>
                    <Row style={{marginTop: "30px", width: "100%"}}>
                        <Text strong style={{padding: "5px 15px"}}>
                            Notes
                        </Text>
                        <Input.TextArea name = 'notes' value = {value.notes} onChange = {onChange} style={{width: "100%"}}/>
                    </Row>
                    {loading ? 
                        <Spinner />
                    :
                        <div style = {{marginTop: "30px", display: "flex", width: "100%", alignItems: "center"}}>
                            <Button size = 'long' danger onClick = {() =>{window.localStorage.removeItem('new'); navigate(-1)}}>Back</Button>
                            <div style = {{marginLeft: "auto"}}>
                                <Button size = 'long' primary onClick = {() =>{
                                    
                                }}>Download</Button>
                                <Button size='long' secondary onClick = {saveData}>Save</Button>
                            </div>
                        </div>
                    }
                </FlexContainer>
            </AdminDashboardLayout>
        </RequireAuth>
    );
}
