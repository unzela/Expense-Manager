using System;
using System.Linq;
using Expenses.Data;
using Expenses.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace Expenses.Controllers
{
    [EnableCors]
    [Route("auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
        {
            private readonly AppDbContext dbContext;
            public AuthenticationController(AppDbContext dbContext)
            {
                this.dbContext = dbContext;
            }

        [Route("login")]
        [HttpPost]
        public ActionResult<User> Login([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.Password))
                return BadRequest("Enter your username and password");

            try
            {
                    var exists = dbContext.Users.Any(n => n.UserName == user.UserName && n.Password == user.Password);
                    if (exists) return Ok(CreateToken(user));

                    return BadRequest("Wrong credentials");
                }
             catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("register")]
        [HttpPost]
        public ActionResult<User> Register([FromBody] User user)
        {
            try
            {
                 var exists = dbContext.Users.Any(n => n.UserName == user.UserName);
                 if (exists) return BadRequest("User already exists");

                dbContext.Users.Add(user);
                dbContext.SaveChanges();

                    return Ok(CreateToken(user));
                }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return null;
        }

        private JwtPackage CreateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.Email, user.UserName)
            });

            const string secretKey = "your secret key goes here";
            var securityKey = new SymmetricSecurityKey(Encoding.Default.GetBytes(secretKey));
            var signinCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var token = tokenHandler.CreateJwtSecurityToken(
                    subject: claims,
                    signingCredentials: signinCredentials
                );

            var tokenString = tokenHandler.WriteToken(token);

            return new JwtPackage()
            {
                UserName = user.UserName,
                Token = tokenString
            };
        }
    }
}
public class JwtPackage
{
    public string Token { get; set; }
    public string UserName { get; set; }
}
