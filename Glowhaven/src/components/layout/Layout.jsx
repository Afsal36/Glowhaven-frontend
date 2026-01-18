const { token } = useSelector((state) => state.auth);

useEffect(() => {
  if (token) {
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }
}, [token]);
