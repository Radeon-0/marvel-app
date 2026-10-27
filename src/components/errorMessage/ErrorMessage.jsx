import img from './error.gif';

const ErrorMessage = () => {
    return (
        <img src={img} alt="" style={{ height: '260px', width: '100%', objectFit: 'cover' }} />
    )
}
export default ErrorMessage;