import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cleanActiviySearcher,
  getAllCountries,
  searchCountry
} from "../../redux/actions";
import style from './addCountryForm.module.css'

const AddCountiesForm = ({ setCountriesAdds, countriesAdds }) => {
  // Local STATE
  const [input, setInput] = useState({
    search: "",
    list: []
  });
  const [errAdd, setErrAdd] = useState({});
  
  // Btn Disable
  let btnDisabledAdd = !(input.search.length && !errAdd.add);

  // UseEfect
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCountries());
  }, [dispatch]);

  useEffect(() => {
    if (input.search !== "") dispatch(searchCountry(input.search));
    if (input.search === "") dispatch(cleanActiviySearcher());
  }, [dispatch, input.search]);

  // UseSelector
  const allCountriesArr = useSelector((state) => state.allCountries);
  const countriesName = allCountriesArr.map((c) => c.name.toLowerCase());
  const activtySearcher = useSelector((state) => state.activtySearcher);

  // validator input Searchs
  const validatorAdd = (input) => {
    const error = {};
    if (![...countriesName].filter((c) => c.match("^\\b" + input.toLowerCase())).length)
      error.add = "don't exist this country";
    return error;
  };

  // input Searchs
  const handleSearch = (e) => {
    setErrAdd(validatorAdd(e.target.value));
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // ADD button 
  const handleClick = () => {
    if (activtySearcher.length !== 0) {
      if (!input.list.map((c) => c.name).includes(activtySearcher[0].name)) {
        setInput({
          ...input,
          list: [...input.list, activtySearcher[0]],
          search: "",
        });

        // props
       return setCountriesAdds({
          ...countriesAdds,
          list: [...countriesAdds.list, activtySearcher[0]],
        });
      }
    }
    setInput({
      ...input,
      search: "",
    });
  };

  // button <country>  On country list ADD
  const handleAddCountry = (e) => {
    if (!input.list.map((c) => c.name).includes(activtySearcher[e.target.name].name)) {

      setInput({
        ...input,
        list: [...input.list, activtySearcher[e.target.name]],
        search: "",
      });

      //props
      setCountriesAdds({
        ...countriesAdds,
        list: [...countriesAdds.list, activtySearcher[e.target.name]],
      });
    }

  };

// button "X" On country list Delete
  const handleDeleteCountry = (e) => {
    setInput({
      ...input,
      list: input.list.filter((c) => c.id !== e.target.name),
    });

    // Props
    setCountriesAdds({
      ...countriesAdds,
      list: input.list.filter((c) => c.id !== e.target.name),
    });
  };
  const handleSubmit = (e)=>{
    e.preventDefault();
  }
  return (
    <>
    <form  className={style.form} onSubmit={handleSubmit} >
      <input
        type="text"
        placeholder="= search a city and add it ="
        name="search"
        onChange={handleSearch}
        />
      <button type="reset" disabled={btnDisabledAdd} onClick={handleClick}>
      ADD
      </button>
      <div className={style.findResult}>
        <ul>
          {activtySearcher.map(
            (c, i) =>
            i < 5 && (
              <li key={c.name}>
                  <button name={i} type="reset" onClick={handleAddCountry}>{c.name}</button>
                </li>
              )
              )}
        </ul>
      </div>
    </form>
      {errAdd.add && <p>{errAdd.add} </p>}
      <div className={style.list}>
        <ul>
          <p>COUNTRIES ADDS</p>
          {input.list.map((c) => (
            <li key={c.name}>
              <label>{c.name}</label>
              <button name={c.id} onClick={handleDeleteCountry}>
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AddCountiesForm;
