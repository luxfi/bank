import { Navigate, useNavigate } from "react-router-dom";
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
import { loadAccountsList, selectAccounts } from "../../../features/accounts/AccountsListSlice";
import { selectBalances } from "../../../features/balances/BalancesListSlice";

export default function SubAccount() {
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const accounts = useAppSelector(selectAccounts);
    const balances = useAppSelector(selectBalances)
    useEffect(
        () => {
            dispatch(loadAccountsList());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    // console.log('accounts', accounts);
    // console.log('balances', balances);
    return(
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <ButtonGroup>
                    <Button bgrey style={{borderRadius: '5px'}} margin='10px' onClick={() => {
                        navigate('/dashboard/balances')
                        }}>Account</Button>
                    <Button sky style={{borderRadius: '5px'}} margin='10px' onClick={() => {
                        // console.log('account');
                        dispatch(loadAccountsList());
                        }}>Sub Account</Button>
                </ButtonGroup>
                <Search>
                    <input type="text" name="choose" style={{width: '30vw', padding:'10px', borderRadius: '15px'}}  placeholder="Choose currencies."/>
                </Search>
                <Table>
                    <TableHeadWithItems items={['Account ID', 'GBP Balance', 'USD Balance', 'SEK Balance', 'AUD Balance']} />

                    <TableBody>
                        {
                            accounts.map(account=>(
                                    <TableRow key={account.id}>
                                        <TableCell><Link to = {'/dashboard/accounts/' + account.id + '/contacts'}> { account.id} </Link></TableCell>
                                        <TableCell> 0.00 </TableCell>
                                        <TableCell> 0.00 </TableCell>
                                        <TableCell> 0.00 </TableCell>
                                        <TableCell> 0.00 </TableCell>
                                    </TableRow>
                            ))
                        }
                        
                    </TableBody>
                </Table>
                
               <NextButton>
                    <Button sky style = {{width: '50vh', margin:'50px 0px'}} onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
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
