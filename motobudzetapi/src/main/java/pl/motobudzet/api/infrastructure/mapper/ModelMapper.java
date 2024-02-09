package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.model.Model;
import pl.motobudzet.api.domain.model.ModelDTO;

public class ModelMapper {

    private ModelMapper() {
    }

    public static ModelDTO mapToModelDTO(Model model) {
        return ModelDTO.builder()
                .id(model.getId())
                .name(model.getName())
                .build();
    }

    public static Model mapToModelEntity(ModelDTO model) {
        return Model.builder()
                .id(model.id())
                .name(model.name())
                .brand(BrandMapper.mapToBrandEntity(model.brand()))
                .build();
    }

}
