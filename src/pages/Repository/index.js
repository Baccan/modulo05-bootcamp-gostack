import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';

// import { Container } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        // queryParams repassados pela URL
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });

    // console.log(repository);
    // console.log(issues);
  }

  render() {
    const { repository, issues, loading } = this.state;

    return <h1>Repository</h1>;
  }
}
