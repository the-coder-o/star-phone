import { languageContext } from "../../language/languageContext";
import { collection, getDocs } from "firebase/firestore";
import { Fragment, useContext } from "react";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { Link } from "react-router-dom";
import Translation from "../../language/language.json";
import ReactPaginate from "react-paginate";
import Loader from "../../Loader/Loader";
import "./cards.css";

const Cards = () => {
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState([]);
  const userCollectionRef = collection(db, "users");
  const [pageNum, setPagNum] = useState(0);
  const usersPage = 15;
  const pageVisit = pageNum * usersPage;
  const { lang, setLanguage } = useContext(languageContext);
  const [content, setContent] = useState({});

  useEffect(() => {
    if (lang == "English") {
      setContent(Translation.English);
    } else if (lang == "Russian") {
      setContent(Translation.Russian);
    } else if (lang == "Uzbek") {
      setContent(Translation.Uzbek);
    }
  });

  useEffect(() => {
    setLoader(true);
    const getUser = async () => {
      const data = await getDocs(userCollectionRef);
      setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoader(false);
    };
    getUser();
  }, []);

  if (loader) {
    return <Loader />;
  }

  const pageCount = Math.ceil(user.length / usersPage);
  const changePage = ({ selected }) => {
    setPagNum(selected);
  };

  const displayUsers = user
    .slice(pageVisit, pageVisit + usersPage)
    .map((elem) => {
      return (
        <div key={elem.id} className="discount">
          <div className="discount__like">
            <div className="disc">
              <p>{elem.discount}</p>
            </div>
            <div className="like">
              <i class="fa-solid card__plus shop fa-cart-plus"></i>
              <i class="fa-regular card__plus fa-heart"></i>
            </div>
          </div>
          <div className="card__img">
            <img src={elem.img} alt="" />
          </div>
          <div className="card__text">
            <p>{elem.model}</p>
          </div>
          <div className="star">
            <i class="fa-solid stars fa-star"></i>
            <i class="fa-solid stars fa-star"></i>
            <i class="fa-solid stars fa-star"></i>
            <i class="fa-solid stars fa-star"></i>
            <i class="fa-solid stars fa-star"></i>
          </div>
          <div className="price">
            <h6>{elem.priceDel} uzs</h6>
            <p>{elem.price} uzs</p>
          </div>
          <div className="btn">
            <Link to={"/Singl"}>
              <a href="/" className="custom-btn btn-15 button__add">
                {content?.CardsDISCOUNT?.text2}
              </a>
            </Link>
          </div>
        </div>
      );
    });
  return (
    <Fragment>
      <div className="container">
        <h2 className="newsPro">Новые продукты</h2>
        <div className="cards__father">
          <div className="cards">
            {displayUsers}
            <ReactPaginate
              previousLabel={<i class="fa-solid fa-arrow-left"></i>}
              nextLabel={<i class="fa-solid fa-arrow-right"></i>}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttn"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Cards;
