import React, { Component } from 'react';
import NewsList from './components/NewsList';
import Category from './components/Category';
import Sources from './components/Sources';

const API_KEY = '62a5f2039f7e4057acc89f4c1fbf17dd';

class App extends Component {
  constructor(props) {
		super(props);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
		this.state = {
      'sources': [],
      'category': 'technology',
      'media': ['techcrunch'],
      'news': []
    };
	}

  categories(sources) {
    let lookup = {};
    let category = [];
    sources.forEach((source) => {
      if(!(source.category in lookup)) {
        lookup[source.category] = true
        category.push(source.category);
      }
    });

    return category;
  }

  fetchSources() {
    const URL = 'https://newsapi.org/v1/sources?language=en';

    fetch(URL).then((res) => res.json()).then((data) => {
      // update state with API data
      this.setState({
        'sources': data.sources
      });
    });
  }

  fetchNews(media) {
    const URL = 'https://newsapi.org/v1/articles?sortBy=latest&apiKey='+API_KEY+'&source=';
    let newsList = [];

    media.map(function(mediaSource, i) {
      fetch(URL+mediaSource).then((res) => res.json()).then((data) => {
        newsList.push(data);
      });
    });

    this.setState({
        'news': newsList
    });
  }

  handleCategoryChange(event) {
		this.setState({
			'category': event.target.value
		});
	}

  handleSourceChange(event) {
    let currentMedia = this.state.media;
    let media = event.target.value;

    if (event.target.checked === true) {
      currentMedia.push(media);
    } else {
      let index = currentMedia.indexOf(media);
      if (index > -1) {
        currentMedia.splice(index, 1);
      }
    }

    this.setState({
      'media': currentMedia
    });

  }

  componentWillMount() {
    this.fetchSources();
    this.fetchNews(this.state.media);
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Nius</h1>
        </header>
        <Category sources={this.categories(this.state.sources)} value={this.state.category} onChange={this.handleCategoryChange} />
        <Sources sources={this.state.sources} category={this.state.category} media={this.state.media} onChange={this.handleSourceChange} />
        <NewsList news={this.state.news} category={this.state.category} />
      </div>
    );
  }

}

export default App;
