using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System;
using ProEventos.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using ProEventos.API.Extensions;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RedesSociaisController : ControllerBase
    {
        private readonly IRedeSocialService _redeSocialService;
        private readonly IEventoService _eventoService;
        private readonly IPalestranteService _palestranteService;

        public RedesSociaisController(IRedeSocialService redeSocialService,
                                      IEventoService eventoService,
                                      IPalestranteService palestranteService)
        {
            _redeSocialService = redeSocialService;
            _eventoService = eventoService;
            _palestranteService = palestranteService;
        }

        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetByEvento(int eventoId)
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                    return Unauthorized("Você não é o organizador deste evento.");

                var redeSociais = await _redeSocialService.GetAllByEventoIdAsync(eventoId);
                if(redeSociais == null) return NoContent();    

                return Ok(redeSociais);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar rede social por evento. Erro: {ex.Message}");
            }
        }

        [HttpGet("palestrante")]
        public async Task<IActionResult> GetByPalestrante()
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if(palestrante == null) return Unauthorized("Você não é um palestrante.");

                var redeSociais = await _redeSocialService.GetAllByPalestranteIdAsync(palestrante.Id);
                if(redeSociais == null) return NoContent();    

                return Ok(redeSociais);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar rede social por palestrante. Erro: {ex.Message}");
            }
        }

        [HttpPut("evento/{eventoId}")]
        public async Task<IActionResult> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                    return Unauthorized("Você não é o organizador deste evento.");

                var redeSocial = await _redeSocialService.SaveByEvento(eventoId, models);
                if(redeSocial == null) return NoContent();

                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar salvar rede social por evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("palestrante")]
        public async Task<IActionResult> SaveByPalestrante(RedeSocialDto[] models)
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if(palestrante == null) return Unauthorized("Você não é um palestrante.");

                var redeSocial = await _redeSocialService.SaveByPalestrante(palestrante.Id, models);
                if(redeSocial == null) return NoContent();

                return Ok(redeSocial);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar salvar rede social por palestrante. Erro: {ex.Message}");
            }
        }

        [HttpDelete("evento/{eventoId}/{redeSocialId}")]
        public async Task<IActionResult> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                    return Unauthorized("Você não é o organizador deste evento.");

                var redeSocial = await _redeSocialService.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(redeSocial == null) return NoContent();     

                return await _redeSocialService.DeleteByEvento(eventoId, redeSocialId) ?
                        Ok(new {message = "Rede Social Deletada"}) :
                        BadRequest("Ocorreu um problema não específico ao tentar deletar a Rede Social por Evento.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar a Rede Social por Evento. Erro: {ex.Message}");
            }
        }

        [HttpDelete("palestrante/{redeSocialId}")]
        public async Task<IActionResult> DeleteByPalestrante(int redeSocialId)
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if(palestrante == null) return Unauthorized("Você não é um palestrante.");

                var redeSocial = await _redeSocialService.GetRedeSocialPalestranteByIdsAsync(palestrante.Id, redeSocialId);
                if(redeSocial == null) return NoContent();     

                return await _redeSocialService.DeleteByPalestrante(palestrante.Id, redeSocialId) ?
                        Ok(new {message = "Rede Social Deletada"}) :
                        BadRequest("Ocorreu um problema não específico ao tentar deletar a Rede Social por Palestrante.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar a Rede Social por Palestrante. Erro: {ex.Message}");
            }
        }

        [NonAction]
        private async Task<bool> AutorEvento(int eventoId)
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId() ,eventoId, false);
            if(evento == null) return false;

            return true;
        }
    }
}