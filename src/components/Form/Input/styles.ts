import { TextInput } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";


export const Container = styled(TextInput)`
    width: 100%;
    padding: ${RFValue(16)}px ${RFValue(18)}px;

    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};

    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 5px;

    margin-top: 8px;
`;

// export const container = styled.TextInput``;
// export const container = styled.TextInput``;
