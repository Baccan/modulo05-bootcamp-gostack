import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
  };

  // carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // salvar os dados no localSotrage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, error: false });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      this.setState({ loading: true, error: false });

      const { newRepo, repositories } = this.state;

      if (!newRepo) throw 'Insira um repositório';

      const hasRepos = repositories.find(repo => repo.name === newRepo);

      if (hasRepos) throw 'Este repositório já existe';

      const response = await api.get(`repos/${newRepo}`);

      const { data } = await response;

      const responseData = {
        name: data.full_name,
      };

      this.setState({
        repositories: [...repositories, responseData],
        newRepo: '',
        loading: false,
      });
    } catch (err) {
      this.setState({ error: true });
      alert(err);
    } finally {
      this.setState({
        loading: false,
      });
    }

    // console.log(this.state.repositories);
    // console.log(responseData);
    // console.log(this.state.newRepo);
  };

  render() {
    const { newRepo, repositories, loading, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? ( // se o loading for true mostra o spinner
              <FaSpinner color="#fff" size={14} />
            ) : (
              // senão mostra o sinal de mais
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              {/* encodeURIComponent é responsável por substituir a barra da url do repositório por um encode */}
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
