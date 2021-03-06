import React from 'react';
import styled from '@emotion/styled';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FiSend } from 'react-icons/fi';
import Button from '../ui/Button';
import config from '../../config';
import { charCounter, trimErrorMessage } from '../../utils';
import useForm from '../../hooks/useForm';
import { GET_ALL_MESSAGES } from '../Messages';
import { ErrorMessage } from '../Error';

const ADD_MESSAGE = gql`
  mutation ADD_MESSAGE($title: String!, $message: String!, $author: String!) {
    addMessage(title: $title, message: $message, author: $author) {
      id
    }
  }
`;

const MessageForm = styled.form`
  width: 100%;

  input,
  textarea {
    width: 100%;
    outline: 0;
    border: 0;
    padding: 0.5rem 0.5rem;
    margin: 0.2rem 0;
    font-family: ${({ theme }) => theme.sansSerif};
    background: transparent;
    border-radius: 2px;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.main};
    &:not(output):-moz-ui-invalid:not(:focus),
    &:not(output):-moz-ui-invalid:focus,
    &:not(output):-moz-ui-invalid:-moz-focusring:not(:focus) {
      box-shadow: none;
    }

    &::placeholder {
      text-transform: uppercase;
      font-size: 0.65rem;
      font-family: ${({ theme }) => theme.sansSerif};
    }
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.black};
  width: 90%;
  &::after {
    content: '';
    width: 100%;
    height: 1px;
    display: block;
    background-color: ${({ theme }) => theme.main};
  }
  .counter {
    text-align: right;
    margin: 0;
    font-size: 0.65rem;
    color: ${({ theme }) => theme.main};
  }
`;

const Input = styled.input``;

const Textarea = styled.textarea`
  transition: 'all .2s ease';
  overflow: hidden;
`;

const Form = () => {
  const { values, handleChange, handleSubmit } = useForm();
  // Passed to charCounter fn.
  let textFieldLength = values && values.message ? values.message.length : 0;
  // For increasing textfield height.
  const increaseHeight = e => {
    const { scrollHeight, clientHeight } = e.target;
    if (scrollHeight > clientHeight) {
      e.target.style.height = `${scrollHeight}px`;
    }
  };

  return (
    <Mutation
      mutation={ADD_MESSAGE}
      variables={values}
      refetchQueries={[
        {
          query: GET_ALL_MESSAGES
        }
      ]}
    >
      {(addMessage, { error, loading }) => {
        return (
          <MessageForm
            onSubmit={e => {
              handleSubmit(e, addMessage);
            }}
          >
            <Label>
              <Input
                type="text"
                placeholder="Title"
                name="title"
                maxLength="50"
                value={values.title || ''}
                required
                onChange={handleChange}
              />
            </Label>
            <Label>
              <Textarea
                placeholder="Message"
                name="message"
                maxLength={config.messageLength}
                value={values.message || ''}
                required
                onChange={e => {
                  handleChange(e);
                  increaseHeight(e);
                }}
                style={{ transition: 'all .2s ease', overflow: 'hidden' }}
              />
              <p className="counter">
                {charCounter(textFieldLength, config.messageLength)}
              </p>
            </Label>
            <Label>
              <Input
                type="text"
                placeholder="Name"
                name="author"
                maxLength="50"
                value={values.author || ''}
                required
                onChange={handleChange}
              />
            </Label>
            {error ? (
              <ErrorMessage>{trimErrorMessage(error.message)}</ErrorMessage>
            ) : null}
            <Button type="submit" disabled={loading}>
              Post{loading ? 'ing' : null}
              <FiSend style={{ lineHeight: '0' }} />
            </Button>
          </MessageForm>
        );
      }}
    </Mutation>
  );
};

export default Form;
