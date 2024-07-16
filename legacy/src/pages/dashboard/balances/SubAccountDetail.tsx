import { Navigate, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserRoles } from "../../../features/auth/user-role.enum";
import { Formik  } from "formik";
import styled from 'styled-components';
import Button from "../../../components/Button";
import { ButtonsContainer } from "../../registration/components/ButtonsContainer";
import InputField from "../../../components/InputField";
import TextInputField from "../../../components/TextInputField";
import { Link } from "react-router-dom";
import CurrencyFlag from "react-currency-flags";
import { device } from '../../../utils/media-query-helpers';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";
import { Table } from "../components/Table";
import { TableHeadWithItems } from "../components/TableHead";
import { TableBody } from "../components/TableBody";
import { TableRow } from "../components/TableRow";
import { TableCell } from "../components/TableCell";
import { loadAccountsList, loadContactsList, selectAccounts, selectContacts } from "../../../features/accounts/AccountsListSlice";
import { selectBalances } from "../../../features/balances/BalancesListSlice";

export default function SubAccountDetail() {
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const contacts = useAppSelector(selectContacts);
    // const accounts = useAppSelector(selectAccounts)
    const {account_id} = useParams();

    // console.log('accounts', account_id);
    useEffect(()=>{
        if(account_id){
            dispatch(loadContactsList({account_id}))
        }
        
    }, [dispatch, account_id])
    // const account = accounts.filter(account=>account.id===account_id);
    // console.log('contacts', contacts);
    // console.log('accounts', accounts);
    return(
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <ButtonGroup>
                    <Button primary style={{borderRadius: '5px', margin:'10px'}}  onClick={() => console.log('contact')}>Add Contact</Button>
                    <Button secondary style={{borderRadius: '5px'}}  onClick={() => {
                        // console.log('disable contact');
                        }}>Disable Contact</Button>
                </ButtonGroup>
                <Search>
                    <input type="text" name="contact" style={{width: '30vw', padding:'10px', borderRadius: '15px'}}  placeholder="Search Contact."/>
                </Search>
                <Table>
                    <TableHeadWithItems items={['Last Name', 'First Name', 'Platform Login Id', 'Email']} />

                    <TableBody>
                    {
                        contacts.map(contact=>(
                            <TableRow key={contact.id}>
                                <TableCell> {contact.last_name} </TableCell>
                                <TableCell> {contact.last_name} </TableCell>
                                <TableCell> {contact.login_id} </TableCell>
                                <TableCell> {contact.email_address} </TableCell>
                            </TableRow>
                        ))
                        
                    }
                    
                        
                    </TableBody>
                </Table>
                
               <NextButton>
                    <Button secondary style = {{width: '50vh', margin:'50px 0px'}} onClick={() => navigate('/dashboard/balances')}>Back to Account List</Button>
               </NextButton>
            </DashboardLayout>
        </RequireAuth >
    )
};
const NextButton =styled.div`
    @media(max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    @media(max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
`;

const ButtonGroup = styled.div`
    @media (max-width: 768px){
        
        display: flex;
        justify-content: center;
        /* display: flex; */
        align-items: center;
        flex-direction: column;
    }
    flex-direction: row;
    justify-content: flex-start;
    /* align-items: center; */
    
`
const Search =styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px auto;
`
const ListGroup =styled.ul`
    padding: 0;
    border: 1px solid ${(props)=>props.theme.colors.bgrey};
    border-bottom: none;
    `
const ListGroupItem = styled.li`
    display: flex;
    color:  ${(props) =>props.theme.colors.black};
    font-size:18px;
    margin:20px 0;
    padding: 5px 20px;
    justify-content: space-between;
    list-style-type: none;
    border-bottom: 1px solid ${(props)=>props.theme.colors.bgrey};
    /* padding-bottom: 20px; */
`
const ListTextGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
`
const ListTextGroupItem = styled.p`
    margin: 0;
`
const ListGroupImageAndTextItem = styled.div`
    display: flex;
    align-items: center;
    
`
