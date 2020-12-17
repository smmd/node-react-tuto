// Imports
// --------------------------------
import React, { useState, useEffect } from 'react';
import { Header, Main, Item , Modal} from './styles';

// Render
// --------------------------------
export default () => {
    const [items, setItems] = useState([
        {
            name: "Maybelline Base de Maquillaje Fit Me Matte, 220 Natural Beige",
            url: "/Maybelline-New-York-Matte-Plus/dp/B00PFCSURS/ref=sr_1_1?dchild=1&keywords=maquillaje&qid=1608078725&sr=8-1",
            image: "https://m.media-amazon.com/images/I/711tffepP1L._AC_UL320_.jpg",
            price: "142.00",
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [timeoutState, setTimeoutState] = useState(null);
    const [fetching, setFetching] = useState(false);

    const httpRequest = query => {
        fetch(`http://localhost:5000/search?q=${query}`)
            .then((response) => {
                const json = response.json();

                if (response.ok) {
                    return json;
                }
                return Promise.reject('Something went wrong.');
            })
            .then((json) => {
                setSearchResults(json.data);
                setFetching(false);
            })
            .catch((e) => {
                console.log("e", e);
                setFetching(false);
            });
    };

    const onChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const onKeyUpSearch = (event) => {
        if (search && search.length > 0) {
            clearTimeout(timeoutState);
            setTimeoutState(
                setTimeout(() => {
                    httpRequest(search);
                    setFetching(true);
                }, 500)
            );
        }
    };

    const onClickToggleModal = () => {
        setShowModal(!showModal);
        setSearchResults([]);
        setSearch("");
    }

    const addItem = item => () => {
        setItems([...items, item]);
        localStorage.setItem('myItems', JSON.stringify([...items, item]));
    }

    const deleteItem = (k) => () => {
        const newItems = [...items.slice(0, k), ...items.slice(k + 1)];
        setItems(newItems);
        localStorage.setItem("myItems", JSON.stringify(newItems));
    };

    useEffect(() => {
        setItems(JSON.parse(localStorage.getItem("myItems")) || []);
    }, []);

    return (
        <div>
            <Header background="https://pbs.twimg.com/profile_banners/1422058765/1482802543/1500x500">
                <div>
                    <a href="https://twitter.com/sagmmd">
                        <img alt="sagmmd"
                             src="https://pbs.twimg.com/profile_images/1336387092872617986/dB-XLxmd_400x400.jpg"/>
                        <h1>@sagmmd</h1>
                        <p>Personal Wishlist</p>
                    </a>
                </div>
                <button onClick={onClickToggleModal}>Add Item</button>
            </Header>

            <Main>
                {items && items.length > 0 ? (
                    <section>
                        {items.map((i, k) => (
                            <Item key={`Item-${k}`}>
                                <dl>
                                    <dt>...</dt>
                                    <dd onClick={deleteItem(k)}>Delete</dd>
                                </dl>
                                <span>${i.price}</span>
                                <img alt={i.name} src={i.image} />
                                <h3>{i.name}</h3>
                                <a href={`https://www.amazon.com.mx${i.url}`} target="_blank" rel="noopener noreferrer">View On Amazon</a>
                            </Item>
                        ))}
                    </section>
                ) : (
                    <section><p>No items yet<br/>
                    <span onClick={onClickToggleModal}>Start By Adding An Item</span></p></section>
                )}
            </Main>

            <Modal show={showModal}>
                <div>
                    <button onClick={onClickToggleModal}>&times;</button>
                    <h1>Add Item</h1>
                    <input
                        disabled={fetching}
                        type="search"
                        value={search}
                        onChange={onChangeSearch}
                        onKeyUp={onKeyUpSearch}
                        placeholder="Search for products"
                    />
                    <section>
                        {fetching && (
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="38"
                                    height="38"
                                    viewBox="0 0 38 38"
                                    stroke="#666666"
                                >
                                    <g fill="none">
                                        <g transform="translate(1 1)" strokeWidth="2">
                                            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                                            <path
                                                d="M36 18c0-9.94-8.06-18-18-18"
                                                transform="rotate(277.527 18 18)"
                                            >
                                                <animateTransform
                                                    attributeName="transform"
                                                    type="rotate"
                                                    from="0 18 18"
                                                    to="360 18 18"
                                                    dur="1s"
                                                    repeatCount="indefinite"
                                                />
                                            </path>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        )}
                        {!fetching &&
                        searchResults &&
                        searchResults.length > 0 &&
                        searchResults.map((i, k) => (
                            <article key={`items-${k}`}>
                                <div>
                                    <img alt={i.name} src={i.image} />
                                </div>
                                <h3>{i.name}</h3>
                                <span>${i.price}</span>
                                <button onClick={addItem(i)}>+</button>
                            </article>
                        ))}
                    </section>
                </div>
            </Modal>
        </div>
    );
};
