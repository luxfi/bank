import { PropsWithChildren, useEffect } from "react";

import { UserRole } from "../features/auth/user-role.enum";
import { checkAuth, selectCurrentUser } from "../features/auth/AuthSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserDocuments } from "../features/documents/DocumentsSlice";
import { EntityType } from "../features/registration/RegistrationSlice";
import { individualDocuments } from "../features/documents/model/individualDocuments";
import { businessDocuments } from "../features/documents/model/businessDocuments";
import { snakeToWords } from "./functions";

interface Props {
    roles?: UserRole[];
    reverse?: boolean;
    ignore?: boolean;
}

export default function UserRoleChecker(props: PropsWithChildren<Props>) {
    const currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();

    const user = useAppSelector(selectCurrentUser);
    const documents = useAppSelector(selectUserDocuments);
    const documentTypes = documents.map((document) => document.type);

    const missing = [];
    if (user) {
        const requiredDocuments =
            user.currentClient?.account?.entityType === EntityType.Individual
                ? individualDocuments
                : businessDocuments;

        for (const requiredDocument of requiredDocuments) {
            if (!documentTypes.includes(requiredDocument.type))
                missing.push(snakeToWords(requiredDocument.type));
        }
    }

    useEffect(() => {
        dispatch(checkAuth());
    }, []);

    if (!currentUser) {
        return <></>;
    }

    const isApproved =
        currentUser.isApproved || currentUser.role === UserRole.SuperAdmin;

    if (!isApproved && !props.reverse && !props.ignore) {
        return <></>;
    }

    if (props.reverse && isApproved && !missing.length) {
        return <></>;
    }

    if (Array.isArray(props.roles) && !props.roles.includes(currentUser.role)) {
        return <></>;
    }

    return <>{props.children}</>;
}
