Elastic instabilities using `auto-07p`
--------------------------------------

Elastic materials are characterised by their ability to undergo local
dilation, shear and twist under externally applied load and relax to a
neutral configuration when the load is removed. More often when the
applied load exceeds a critical value these materials undergo
instabilities characterized by a smooth or dramatic change in their
morphology. These instabilities are captured by identifying the forces
at play and deriving governing equations for the deformation of the
material. The deformation is then related to the internal stress through
a constituent relation. In this set of 5 tutorials we will see how to
solve for the deformation field of the material and capture the various
instabilities using [`auto-07p` ](https://github.com/auto-07p/auto-07p),
a numerical continuation package. These elastic instability problems, as
we shall see, are boundary value problems which are many a times hard to
solve even numerically (analytical solutions are very scarce). The
purpose of this tutorial really is to highlight the power of `auto-07p`
in solving these systems. Though the documentation if a a very good
place to start, I realized during the learning process that there are a
few important technical gaps that are often not discussed if one were to
go from the documentation to implementing it in your research problem.

In this series we will be discussing 5 example problems, each with
certain unique aspect in terms of implementing it in `auto-07p`
associated with the type of problem. It will become clear what I mean by
this as we go over the examples.

We begin by introducing the `auto-07p` framework [here](./).

The problems we will be looking at are

-   [Bending of an *elastica*](./)

-   Buckling of a sheet

-   Beam with oscillating forcing

-   Growth of a sheet

-   Periodic solutions to sheet deformation

[back](./fun)
