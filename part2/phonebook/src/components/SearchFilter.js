const SearchFilter = ({filter, filterByName}) =>{
    return (
        <div>filter shown with <input value={filter} onChange={filterByName}/></div>
    )
}
export default SearchFilter