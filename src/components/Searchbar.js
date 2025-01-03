import './Searchbar.css'

const Searchbar =()=> {
    return (
        <div>
            <div className="search-bar">
                <input type="text" placeholder="ค้นหาด้วยไอดี..."/>
                <button><i className="fas fa-search"></i></button>
            </div>
        </div>
    )
}

export default Searchbar;