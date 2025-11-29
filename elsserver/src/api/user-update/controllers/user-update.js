const bcrypt = require('bcryptjs');

module.exports = {
  async adminResetPassword(ctx) {
    try {
      const { userId, password, sendEmail } = ctx.request.body;
      if (!userId || !password) return ctx.badRequest('Missing userId or password');

      // find user by documentId
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { documentId: userId },
      });
      if (!user) return ctx.notFound('User not found');

      // hash password manually using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // update password
      const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // optionally send reset email
      if (sendEmail) {
        // e.g., await strapi.plugins['email'].services.email.send({...})
      }

      ctx.body = { data: { message: 'Password updated successfully', id: updatedUser.id } };
    } catch (err) {
      console.error('Password reset error:', err);
      ctx.badRequest('Error resetting password', { error: err.message });
    }
  },

  async updateByDocumentId(ctx) {
    try {
      const { documentId } = ctx.params;
      const payload = ctx.request.body?.data;
      if (!documentId || !payload) return ctx.badRequest("Missing documentId or data");

      const authUser = ctx.state.user;
      if (!authUser) return ctx.unauthorized("Authentication required");

      const target = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { documentId },
        select: ['id', 'documentId'],
      });

      if (!target) return ctx.notFound("User not found");
      
      // Allow ADMIN or SUPERADMIN or self-update
      const roleVal = authUser.user_role || (authUser.role && authUser.role.name) || '';
      const isAdminRole = ['ADMIN', 'SUPERADMIN'].includes(String(roleVal).toUpperCase());
      if (!isAdminRole && authUser.documentId !== documentId) {
        return ctx.forbidden('Not allowed');
      }

      const allowedFields = ['first_name', 'last_name', 'mobile_number', 'user_experience_level', 'user_role'];
      const data = {};
      for (const key of allowedFields) {
        if (payload[key] !== undefined) data[key] = payload[key];
      }
      if (Object.keys(data).length === 0) return ctx.badRequest('No permitted fields provided to update');

      const updated = await strapi.entityService.update('plugin::users-permissions.user', target.id, { data });

      ctx.body = {
        data: {
          documentId: updated.documentId,
          username: updated.username,
          first_name: updated.first_name,
          last_name: updated.last_name,
          user_role: updated.user_role,
          mobile_number: updated.mobile_number,
        },
      };
    } catch (err) {
      ctx.badRequest('Error updating user', { error: err.message });
    }
  },
};
