import { UnprocessableEntityError, NotFoundError } from 'restify-errors';
import RestaurantModel, { RestaurantDocument, MenuItemDocument } from "./restaurants.model";

class RestaurantService {

    /**
     * Retorna uma listagem com todos os recursos Restaurant que atendem ao filtro
     * @param filter RestaurantFilter Filtro
     * @returns Promise<RestaurantDocument[]> com a lista de recursos encontrados
     */
    public find(filter?: RestaurantFilter): Promise<RestaurantDocument[]> {
        return RestaurantModel.find(this.buildFilter(filter))
            .then(docs => docs);
    }

    /**
     * Busca um recurso através do seu Id
     * @param id Id do recurso
     * @returns Promise<RestaurantDocument | null> contendo o recurso encontrado ou nulo caso não encontrado
     */
    public load(id: string): Promise<RestaurantDocument | null> {
        return RestaurantModel.findById(id)
            .then(doc => doc);
    }

    /**
     * Cria um novo recurso Restaurant
     * @param hello recurso a ser criado
     * @returns Promise<RestaurantDocument | null> com o recurso criado ou nulo caso não tenha sido criado
     * @throws UnprocessableEntityError Caso o nome informado já esteja em uso
     */    
    public async create(restaurant: RestaurantDocument): Promise<RestaurantDocument> {

        const foundRestaurant = await RestaurantModel.findOne({ name: restaurant.name });
        if (foundRestaurant)
            throw new UnprocessableEntityError('Já existe um restaurante com o nome informado');

        return RestaurantModel.create(restaurant);
    }

    /**
     * Faz a alteração do recurso Restaurant
     * @param id Id do recurso a ser alterado
     * @param restaurant recurso a ser alterado
     * @param overwrite indica se os campos não informados serão sobrescritos (default true).
     * caso seja true e não seja passado um campo, o mesmo será removido do recurso
     * caso seja false e não seja passado um campo, o mesmo não sofrerá alterações
     * @returns Promise<RestaurantDocument | null> contendo o recurso já com a alteração 
     * ou nulo caso o recurso não tenha sido encontrado
     */
    public update(id: string, restaurant: RestaurantDocument, overwrite: boolean = true): Promise<RestaurantDocument | null> {
        const options = { runValidators: true, new: true, overwrite };
        return RestaurantModel.findByIdAndUpdate(id, restaurant, options)
            .then(doc => doc);
    }

    /**
     * Remove um recurso Restaurant
     * @param id Id do recurso a ser removido
     * @returns Promise<RestaurantDocument | null> com o recurso removido ou nulo caso recurso não exista
     */
    public delete(id: string): Promise<RestaurantDocument | null> {
        return RestaurantModel.findByIdAndDelete(id)
            .then(doc => doc);
    }

    /**
     * Carrega o menu de um restaurante
     * @param idRestaurant string
     */
    public loadMenu(idRestaurant: string): Promise<MenuItemDocument[] | null> {
        return RestaurantModel.findById(idRestaurant, { menu: true })
            .then(docs => {
                if (!docs)
                    throw new NotFoundError('Restaurante não encontrado');
                return docs.menu;
            })
    }

    /**
     * Sobrescreve o menu de um restaurante
     * @param idRestaurant string
     * @param menu MenuItemDocument[]
     */
    public async updateMenu(idRestaurant: string, menu: MenuItemDocument[]): Promise<MenuItemDocument[] | null> {
        
        const restaurant = await RestaurantModel.findById(idRestaurant);

        if (!restaurant)
            throw new NotFoundError('Restaurante não encontrado');

        restaurant.menu = menu;
        
        return restaurant.save()
            .then(restaurant => restaurant.menu);
    }

    private buildFilter(filter?: RestaurantFilter): RestaurantFilter {
        const restaurantFilter: RestaurantFilter = {};
        if (filter) {
            if (filter.name) {
                restaurantFilter.name = { '$regex': filter.name, '$options': 'i' }
            }
        }
        return restaurantFilter;
    }

}

export interface RestaurantFilter {
    name?: string | object;
}

export default new RestaurantService();