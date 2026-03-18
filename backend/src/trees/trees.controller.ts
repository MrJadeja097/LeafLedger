import {
  Controller, Get, Post, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TreesService } from './trees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlantTreeDto } from './tree.dto';

@ApiTags('trees')
@Controller('trees')
export class TreesController {
  constructor(private readonly treesService: TreesService) {}

  // Public: global stats
  @Get('stats')
  getStats() {
    return this.treesService.getStats();
  }

  // Public: all trees (for the world map view)
  @Get()
  getAllTrees() {
    return this.treesService.getAllTrees();
  }

  // Protected: plant a new tree
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  plantTree(@Request() req, @Body() dto: PlantTreeDto) {
    return this.treesService.plantTree(req.user.id, dto);
  }

  // Protected: my trees
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyTrees(@Request() req) {
    return this.treesService.getMyTrees(req.user.id);
  }

  // Public: single tree by ID
  @Get(':id')
  getTreeById(@Param('id') id: string) {
    return this.treesService.getTreeById(id);
  }
}
