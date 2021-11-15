import ITokenDecode from '../../../Shared/InterfaceAdapters/ITokenDecode';
import TokenFactory from '../../../Shared/Factories/TokenFactory';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../repositories';
import { ITokenRepository } from '@digichanges/shared-experience';
import ITokenDomain from '../../InterfaceAdapters/ITokenDomain';
import SetTokenBlacklistUseCase from './SetTokenBlacklistUseCase';
import Locales from '../../../App/Presentation/Shared/Locales';

class LogoutUseCase
{
    @containerFactory(REPOSITORIES.ITokenRepository)
    private tokenRepository: ITokenRepository<ITokenDomain>;
    private tokenFactory: TokenFactory;

    constructor()
    {
        this.tokenFactory = new TokenFactory();
    }

    async handle(tokenDecode:ITokenDecode): Promise<Record<string, string>>
    {
        const tokenId = tokenDecode.id;

        const token: ITokenDomain = await this.tokenRepository.getOne(tokenId);

        const useCase = new SetTokenBlacklistUseCase();
        await useCase.handle(token);

        const locales = Locales.getInstance().getLocales();
        const key = 'auth.domain.messages.logout';

        return { message: locales.__(key), messageCode: key };
    }
}

export default LogoutUseCase;