import { Navigate, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserRoles } from "../../../features/auth/user-role.enum";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import { HalfWidth } from "../components/HalfWidth";
import SelectInputField from "../../../components/SelectInputField";
import { currencies, customers } from "../../../features/beneficiaries/model/currencies";
import { Formik } from "formik";
import { FormRow } from "../components/FormRow";
import InputField from "../../../components/InputField";
import { countries } from "../../../features/registration/model/countries";
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Form } from 'formik';
import { isWithStatement } from "typescript";
import { postTopUpMargin, setPercentAmount } from "../../../features/accountview/ViewPercentSlice";
import { selectActiveAccount } from "../../../features/accounts/AccountsListSlice";
import CurrencyFlag from "react-currency-flags";
export default function PercentTopUp() {
    const navigate = useNavigate();
    const breadcrumbs = useBreadcrumbs();
    const initialValues = {
        amount: '',
    }
    const dispatch = useAppDispatch();
    const activeAccount = useAppSelector(selectActiveAccount);
    return(
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <Formik
                initialValues={initialValues}
                validationSchema={yup.object({
                    amount : yup.number().required('You have to enter a number').test('compare-amount', 'Amount has to be greater than zero', function(value) {
                        return Number(value)>0;
                      })
                })}
                onSubmit={async (data) =>{
                    // console.log(activeAccount);
                    if(Number(data.amount)>0){
                        await dispatch(setPercentAmount(data));
                        await dispatch(postTopUpMargin({
                            currency: activeAccount.active_currency_code,
                            amount: data.amount
                        }));
                        navigate('/dashboard/payments/wizard');
                    }
                   
                   
                }}
                >
                    {
                        ({values, setFieldValue})=>(
                    <StyledForm>
                        <RowContainer>
                            <ListGroupImageAndTextItem>
                                {/* <img src={`${process.env.PUBLIC_URL}/images/balances/euro.png`} width="50" alt="Euro" /> */}
                                <CurrencyFlag
                                    style={{ borderRadius: "50%" }}
                                    currency={activeAccount.active_currency_code}
                                    width={30}
                                    height={30}
                                />
                                <ListTextGroup>
                                    <ListTextGroupItem><strong>{activeAccount.active_currency_code} ({activeAccount.active_currency_amount})</strong></ListTextGroupItem>
                                </ListTextGroup> 
                            </ListGroupImageAndTextItem>
                        </RowContainer>
                        <RowContainer>
                            <AmountContainer>
                                <InputField name="amount" labeltext="Top-Up Margin" placeholder="Amount" /> 
                                {activeAccount.active_currency_code}({activeAccount.active_currency_code})
                            </AmountContainer>
                                <Button primary style={{borderRadius:'5px', padding: '5px 20px', justifyContent:'flex-end'}} type="submit" >Submit</Button>
                        </RowContainer>
                    </StyledForm>
                        )
                    }
                    
            </Formik>
            </DashboardLayout>
        </RequireAuth >
    )
};
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
const AmountContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 50%;
`
const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 10px;
    align-items: center;
`

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
export const StyledForm = styled(Form)`
    @media(max-width: 768px){
        /* margin: 0 auto; */
        margin-top: -20px;
        background-color: ${(props) => props.theme.colors.primary}; 

    }
    
`;
