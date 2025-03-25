import { useParams } from "react-router-dom"
const QuestionPage = () => {
    const {id} = useParams();
    return(
        <div className="bg-white p-8">
        {id}
        </div>
    )
}

export default QuestionPage