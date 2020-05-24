import ReviewModel, { ReviewDocument, ReviewFilter } from './reviews.model';

class ReviewsService {

    /**
     * Retorna uma listagem com todos os recursos Review que atendem ao filtro
     * @param filter RestaurantFilter Filtro
     * @param complete Indica se os dados de review retornados terão os dados de usuário e restaurantes detalhados 
     *                 | False (default) => retorna somente o id do usuário e do restaurante 
     *                 | True => retorna os dados completos do usuário e do restaurante 
     * @returns Promise<ReviewDocument[]> com a lista de recursos encontrados
     */
    public find(filter: ReviewFilter = {}, complete: boolean = false): Promise<ReviewDocument[]> {
        if (!complete) {
            return ReviewModel.find(this.buildReviewFilter(filter))
                .then(docs => docs);
        }
        return ReviewModel.find(this.buildReviewFilter(filter))
            .populate('user', 'name email')
            .populate('restaurant', 'name')
            .then(docs => docs);
    }

    /**
     * Busca um recurso através do seu Id
     * @param id Id do recurso
     * @returns Promise<ReviewDocument | null> contendo o recurso encontrado ou nulo caso não encontrado
     */
    public load(id: string): Promise<ReviewDocument | null> {
        return ReviewModel.findById(id)
            .populate('user', 'name email') // Carrega os dados do usuário no momento da busca do review (nesse caso  campo nome e email)
            .populate('restaurant', 'name') // Carrega os dados do restaurante no momento da busca do review (nesse caso só o campo nome)
            .then(doc => doc)
    }

    /**
     * Cria um novo recurso Restaurant
     * @param hello recurso a ser criado
     * @returns Promise<ReviewDocument> com o recurso criado ou nulo caso não tenha sido criado
     */  
    public create(review: ReviewDocument): Promise<ReviewDocument> {
        return ReviewModel.create(review)
    }

    private buildReviewFilter(filter: ReviewFilter): ReviewFilter {
        const reviewFilter: ReviewFilter = {};
        if (filter) {
            if (filter.restaurant) {
                reviewFilter.restaurant = filter.restaurant;
            }
            if (filter.user) {
                reviewFilter.user = filter.user;
            }
        }
        return reviewFilter;
    }

}

export default new ReviewsService();