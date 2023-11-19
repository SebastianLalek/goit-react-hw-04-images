import PropTypes from 'prop-types';

export default function Searchbar({ onSubmit }) {
  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={onSubmit}>
        <button className="SearchForm-button" type="submit">
          <span className="SearchForm-button-label">&#8981;</span>
        </button>

        <input
          className="SearchForm-input"
          name="query"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
};
