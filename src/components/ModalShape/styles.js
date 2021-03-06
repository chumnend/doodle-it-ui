import styled from 'styled-components';
import { color, layout } from '../../themes';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

export const Button = styled.button`
  width: ${layout.buttonSize};
  height: ${layout.buttonSize};
  font-size: 12px;
  font-family: inherit;
  color: ${color.ebony};
  background: ${color.white};
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${color.white};
    background: ${color.ebony};
  }
`;

export const LineIcon = styled.span`
  width: 2px;
  height: calc(${layout.buttonSize} / 2);
  transform: rotate(45deg);
  background: ${color.ebony};

  ${Button}:hover & {
    background: ${color.white};
  }
`;

export const CircleIcon = styled.span`
  height: calc(${layout.buttonSize} / 2.5);
  width: calc(${layout.buttonSize} / 2.5);
  border-radius: 50%;
  background: ${color.ebony};

  ${Button}:hover & {
    background: ${color.white};
  }
`;

export const RectangleIcon = styled.span`
  height: calc(${layout.buttonSize} / 2.5);
  width: calc(${layout.buttonSize} / 2.5);
  background: ${color.ebony};

  ${Button}:hover & {
    background: ${color.white};
  }
`;

export const TriangleIcon = styled.span`
  width: 0;
  height: 0;
  border-left: calc(${layout.buttonSize} / 5) solid transparent;
  border-right: calc(${layout.buttonSize} / 5) solid transparent;
  border-bottom: calc(${layout.buttonSize} / 2.5) solid ${color.ebony};

  ${Button}:hover & {
    border-bottom-color: ${color.white};
  }
`;
