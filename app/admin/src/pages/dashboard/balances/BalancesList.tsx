import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserRoles } from "../../../features/auth/user-role.enum";
import styled from 'styled-components';
import Button from "../../../components/Button";
import { Link } from "react-router-dom";
import CurrencyFlag from "react-currency-flags";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { loadBalancesList, loadCurrenciesList, selectBalanceError, selectBalances, selectBalanceStatus, selectCurrencies } from "../../../features/balances/BalancesListSlice";
import { loadTransaction, setActiveAccount } from "../../../features/accounts/AccountsListSlice";

export default function BalancesList() {
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [currencyValue, setCurrencyValue] = useState('');
    const currencies = useAppSelector(selectCurrencies);
    const balances = useAppSelector(selectBalances);
    const displayBalances = [...balances].filter(row=>{
        const currencyName = currencies?.filter(c => c.code == row.currency)[0]?.name;
        const currency = row.currency;
        const filterPass =  !currencyValue || currencyName.toLowerCase().indexOf(currencyValue) !== -1 || currency.toLowerCase().indexOf(currencyValue) !== -1;
        if (row.status == 'PENDING') return false;
        return filterPass;
    });
    useEffect(
        () => {
            dispatch(loadBalancesList());
            dispatch(loadCurrenciesList());
        },
        []
    );
    const status = useAppSelector(selectBalanceStatus);
    const error = useAppSelector(selectBalanceError);
    return(
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                {
                    status === 'error' ? 
                        <p style = {{textAlign: 'left', fontWeight: '700', color: 'red'}}>
                            {error}
                        </p>
                    :
                    ''
                }
                <Search>
                    <input type="text" name="search" style={{width: '100%', padding:'10px', borderRadius: '15px'}}  placeholder="Find a currency..." 
                     onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                        // console.log('val', e.target.value);
                        setCurrencyValue(e.target.value.toLowerCase());
                    }} disabled={status === 'error'} />
                </Search>
                
                <ListGroup>
                    <ListGroupItem>
                        <Link to={error ? '#' : "add"} style={{display: 'flex', justifyContent:"space-between", width: '100%'}}>

                            <ListGroupImageAndTextItem>
                                <img src={`${process.env.PUBLIC_URL}/images/plusincircle.png`} width="30" alt="Add" />
                                <ListTextGroup>
                                    <ListTextGroupItem> Add a currency </ListTextGroupItem>
                                </ListTextGroup> 
                            </ListGroupImageAndTextItem>
                            <img src={`${process.env.PUBLIC_URL}/images/nav/left-arrow.svg`} width="30" alt="Left Arrow" />
                            
                        </Link>
                    </ListGroupItem>
                    {
                        displayBalances
                        .map(data=>(
                            <ListGroupItem key={data.account_id}>
                                <Link to={data.currency + '/transactions/' + data.account_id} style={{display: 'flex', justifyContent:"space-between", width: '100%'}} onClick={ async ()=>{
                                        try {
                                           //await dispatch(loadTransaction({currency: data.currency}));
                                           await dispatch(setActiveAccount({id: data.id, account_id: data.account_id, account_amount: data.amount, account_currency: data.currency}));   
                                        } catch (error) {
                                            console.log(error);
                                            
                                        }
                                    }}>
                                    <ListGroupImageAndTextItem>
                                        <CurrencyFlag
                                            style={{ borderRadius: "50%" }}
                                            currency={data.currency}
                                            width={30}
                                            height={30}
                                        />
                                        <ListTextGroup>
                                            <ListTextGroupItem> {data.amount} <strong> {data.currency}</strong></ListTextGroupItem>
                                            <ListTextGroupItem>{currencies?.filter(c => c.code == data.currency)[0]?.name}</ListTextGroupItem>
                                        </ListTextGroup> 
                                    </ListGroupImageAndTextItem>
                                    <img src={`${process.env.PUBLIC_URL}/images/nav/left-arrow.svg`} width="30" alt="Left Arrow" />
                                </Link>
                            </ListGroupItem>
                        ))
                    }
               </ListGroup>
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
    margin: 20px 0px;
    width: 30vw;
    @media(max-width: 768px) {
        width: 100%;
    }
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
