const SearchFilter = ({searchTerm, handleSearchTerm}) =>{
    return (
        <div>filter shown with <input value={searchTerm} onChange={handleSearchTerm}/></div>
    )
}
export default SearchFilter