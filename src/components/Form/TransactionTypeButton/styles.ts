import styled, {css} from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';
import theme  from '../../../global/styles/theme';


interface IconProps {
    type: 'up' | 'down';
}

interface ContainerProps {
    isActive: boolean;
    type: 'up' | 'down';
}

export const Container = styled.View<ContainerProps>`
    width: 48%;
    /* border: 1.5px solid ${({ theme }) => theme.colors.text}; alterado para que as bordas sejam removidas quando selecionado*/
    border-width: ${({ isActive }) => isActive ? 0 : 1.5}px; /*  se estiver ativo, retira a border-radius, caso contrario não aplica a borda */
    border-style: solid; 
    border-color: ${({ theme }) => theme.colors.text};
    border-radius: 5px;

    ${({ isActive, type }) => isActive && type === 'up' && css `
        background-color: ${({ theme }) => theme.colors.success_light};
    `}

    ${({ isActive, type }) => isActive && type === 'down' && css `
        background-color: ${({ theme }) => theme.colors.attention_light};
    `}
`;

export const Button = styled(RectButton)`
    justify-content: center;
    flex-direction: row;
    align-items: center;   
    padding: ${RFValue(16)}px; 
`;

export const Icon = styled(Feather)<IconProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;

    color: ${({ theme, type }) => 
    type === 'up' ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
`;
