import ErrorMessage from "../errorMessage/ErrorMessage.jsx";
import {Link} from 'react-router-dom';

const Page404 = () => {
    return (
        <div>
            <ErrorMessage></ErrorMessage>
            <p style={{'color':'red'}}>404</p>
            <Link to="/">Back to main page</Link>
        </div>
    )
}
export default Page404;