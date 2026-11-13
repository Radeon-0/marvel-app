import AppBanner from "../appBanner/AppBanner.jsx";
import ComicsList from "../comicsList/ComicsList.jsx";
import { Helmet } from 'react-helmet-async';

const comicsPage = () => {
    return (
        <>
            <Helmet>
                <meta name="description" content=" comics page"/>
                <title>comics page</title>
            </Helmet>
            <AppBanner/>
            <ComicsList/>
        </>
    )
}
export default comicsPage;